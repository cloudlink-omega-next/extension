/*
    Cloudlink Omega Browser SDK

    A lightweight browser wrapper around the Omega REST API surface:
    - auth / session
    - cloud saves
    - friends / messaging
    - notifications
    - profile / avatar
    - achievements
    - developer & game registration

    Usage:
      <script src="omega-browser.js"></script>
      <script>
        const omega = new OmegaBrowser({ apiUrl, authUrl });
        await omega.connect();
      </script>
*/

(function (root) {
    'use strict';

    if (typeof window === 'undefined') {
        return;
    }

    const DEFAULT_API_URL = '/api/v1';
    const DEFAULT_AUTH_URL = '/accounts/api/v0';
    const DEFAULT_AUTH_V1_URL = '/accounts/api/v1';

    class EventEmitter {
        on(event, fn) {
            if (!this._events) this._events = {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fn);
            return this;
        }

        off(event, fn) {
            if (!this._events || !this._events[event]) return this;
            if (!fn) {
                delete this._events[event];
                return this;
            }
            this._events[event] = this._events[event].filter(f => f !== fn);
            return this;
        }

        emit(event, payload) {
            if (!this._events || !this._events[event]) return this;
            const listeners = this._events[event].slice();
            for (let i = 0; i < listeners.length; i++) {
                try {
                    listeners[i](payload);
                } catch (e) {
                    console.error(`Omega listener error [${event}]:`, e);
                }
            }
            return this;
        }
    }

    class OmegaBrowser extends EventEmitter {
        constructor(opts) {
            super();
            const base = (opts && opts.baseUrl) || window.location.origin;
            this.apiUrl = (opts && opts.apiUrl) || base + DEFAULT_API_URL;
            this.authUrl = (opts && opts.authUrl) || base + DEFAULT_AUTH_URL;
            this.authV1Url = (opts && opts.authV1Url) || base + DEFAULT_AUTH_V1_URL;
            this.selectedUgi = (opts && opts.ugi) || '01HNPHRWS0N0AYMM5K4HN31V4W';
            this.sessionToken = '';
            this.verbose = !!((opts && opts.verbose));
        }

        log(...args) {
            if (this.verbose) console.log('[OmegaBrowser]', ...args);
        }

        _url(path) {
            return this.apiUrl + path;
        }

        _authUrl(path) {
            return this.authUrl + path;
        }

        _authV1Url(path) {
            return this.authV1Url + path;
        }

        async _request(url, options) {
            const response = await fetch(url, options);
            const text = await response.text();
            let data;
            if (text) {
                try { data = JSON.parse(text); } catch (e) { data = text; }
            }
            return { response, data, text };
        }

        setUgi(ugi) {
            this.selectedUgi = String(ugi);
        }

        getSessionToken() {
            return this.sessionToken;
        }

        async guestLogin(username) {
            const payload = { username: String(username) };
            const result = await this._request(this._authUrl('/guest-login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (result.response.ok) {
                this.sessionToken = result.text;
                this.emit('login', { status: result.response.status });
                return true;
            }
            this.emit('loginError', { status: result.response.status, data: result.data });
            return false;
        }

        async login(email, password, totp) {
            const payload = { email: String(email), password: String(password), totp: String(totp || '') };
            const result = await this._request(this._authUrl('/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (result.response.ok) {
                this.sessionToken = result.text;
                this.emit('login', { status: result.response.status });
                return true;
            }
            this.emit('loginError', { status: result.response.status, data: result.data });
            return false;
        }

        async register(email, username, password) {
            const payload = { email: String(email), username: String(username), password: String(password) };
            const result = await this._request(this._authUrl('/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && (result.text === 'OK' || result.text === 'OK; Email verification disabled');
            if (ok) {
                this.emit('register', { status: result.response.status });
            } else {
                this.emit('registerError', { status: result.response.status, data: result.data });
            }
            return ok;
        }

        async validate() {
            const result = await this._request(this._authV1Url('/validate'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('validate', { ok, status: result.response.status, data: result.data });
            return ok;
        }

        async logout() {
            const result = await this._request(this._authV1Url('/logout'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('logout', { ok, status: result.response.status });
            if (ok) this.sessionToken = '';
            return ok;
        }

        async verify(code) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = { token: this.sessionToken, code: String(code) };
            const result = await this._request(this._authUrl('/verify'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('verify', { ok, status: result.response.status });
            return ok;
        }

        async resendVerify() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._authUrl('/resend-verify'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: this.sessionToken })
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('resendVerify', { ok, status: result.response.status });
            return ok;
        }

        async resetPassword(password) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = { password: String(password) };
            const result = await this._request(this._authV1Url('/reset-password'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('resetPassword', { ok, status: result.response.status });
            return ok;
        }

        async checkUsername(username) {
            const payload = { username: String(username) };
            const result = await this._request(this._authV1Url('/check'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'Username available.';
            this.emit('checkUsername', { ok, status: result.response.status });
            return ok;
        }

        async beginTotpEnrollment() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._authV1Url('/begin-totp-enrollment'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('totpEnrollmentBegin', { ok, status: result.response.status, data: ok ? result.data.data : null });
            return ok ? result.data.data : null;
        }

        async verifyTotpEnrollment(code) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._authV1Url('/verify-totp-enrollment?code=' + encodeURIComponent(String(code))), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('totpEnrollmentVerify', { ok, status: result.response.status, data: ok ? result.data.data : null });
            return ok ? result.data.data : null;
        }

        async sendRecovery(email) {
            const payload = { email: String(email) };
            const result = await this._request(this._authV1Url('/send-recovery'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('recoverySend', { ok, status: result.response.status });
            return ok;
        }

        async confirmRecovery(email, code, totp, backupCode) {
            const payload = {
                email: String(email),
                code: String(code),
                totp: String(totp || ''),
                backup_code: String(backupCode || '')
            };
            const result = await this._request(this._authV1Url('/confirm-recovery'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('recoveryConfirm', { ok, status: result.response.status });
            return ok;
        }

        async changePassword(currentPassword, newPassword) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = {
                current_password: String(currentPassword),
                new_password: String(newPassword)
            };
            const result = await this._request(this._authV1Url('/change-password'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'Password changed successfully.';
            this.emit('changePassword', { ok, status: result.response.status });
            return ok;
        }

        async changeEmail(password, newEmail) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = {
                password: String(password),
                new_email: String(newEmail)
            };
            const result = await this._request(this._authV1Url('/change-email'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('changeEmail', { ok, status: result.response.status });
            return ok;
        }

        async confirmEmailChange(token) {
            const result = await this._request(this._authV1Url('/confirm-email-change?token=' + encodeURIComponent(String(token))), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('confirmEmailChange', { ok, status: result.response.status });
            return ok;
        }

        async disableTotp(backupCode) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = { backup_code: String(backupCode) };
            const result = await this._request(this._authV1Url('/disable-totp'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'TOTP disabled successfully.';
            this.emit('disableTotp', { ok, status: result.response.status });
            return ok;
        }

        async regenerateRecoveryCodes() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._authV1Url('/regenerate-recovery-codes'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('recoveryCodesRegenerate', { ok, status: result.response.status, codes: ok ? result.data.data.recovery_codes : [] });
            return ok ? (result.data.data && result.data.data.recovery_codes) : [];
        }

        async save(saveSlot, saveData) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = { token: this.sessionToken, ugi: this.selectedUgi, save_slot: Number(saveSlot), save_data: String(saveData) };
            const result = await this._request(this._url('/save'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok;
            this.emit('save', { ok, status: result.response.status, text: result.text });
            return ok;
        }

        async load(saveSlot) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = { token: this.sessionToken, ugi: this.selectedUgi, save_slot: Number(saveSlot) };
            const result = await this._request(this._url('/load'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok;
            this.emit('load', { ok, status: result.response.status, data: ok ? result.text : null });
            return ok ? result.text : null;
        }

        async searchUsers(query) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const url = this._url('/friends/search?q=' + encodeURIComponent(String(query)));
            const result = await this._request(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('search', { ok, status: result.response.status, data: ok ? result.data.data : [] });
            return ok ? result.data.data : [];
        }

        async sendFriendRequest(receiverId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = { token: this.sessionToken, receiver_id: String(receiverId) };
            const result = await this._request(this._url('/friends/request'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('friendRequest', { ok, status: result.response.status });
            return ok;
        }

        async acceptFriendRequest(requestId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/friends/request/' + encodeURIComponent(String(requestId)) + '/accept'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('friendAccept', { ok, status: result.response.status });
            return ok;
        }

        async rejectFriendRequest(requestId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/friends/request/' + encodeURIComponent(String(requestId)) + '/reject'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('friendReject', { ok, status: result.response.status });
            return ok;
        }

        async cancelFriendRequest(requestId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/friends/request/' + encodeURIComponent(String(requestId))), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('friendCancel', { ok, status: result.response.status });
            return ok;
        }

        async getFriends() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/friends'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('friends', { ok, status: result.response.status, data: ok ? result.data.data : [] });
            return ok ? result.data.data : [];
        }

        async removeFriend(friendId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/friends/' + encodeURIComponent(String(friendId))), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('friendRemove', { ok, status: result.response.status });
            return ok;
        }

        async sendMessage(receiverId, content) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = { token: this.sessionToken, receiver_id: String(receiverId), content: String(content) };
            const result = await this._request(this._url('/friends/' + encodeURIComponent(String(receiverId)) + '/messages'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('messageSend', { ok, status: result.response.status });
            return ok;
        }

        async getMessages(userId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/friends/' + encodeURIComponent(String(userId)) + '/messages'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('messages', { ok, status: result.response.status, data: ok ? result.data.data : [] });
            return ok ? result.data.data : [];
        }

        async blockUser(blockedId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = { token: this.sessionToken, blocked_id: String(blockedId) };
            const result = await this._request(this._url('/friends/block'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('block', { ok, status: result.response.status });
            return ok;
        }

        async unblockUser(blockedId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = { token: this.sessionToken, blocked_id: String(blockedId) };
            const result = await this._request(this._url('/friends/unblock'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('unblock', { ok, status: result.response.status });
            return ok;
        }

        async getBlocklist() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/friends/blocklist'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('blocklist', { ok, status: result.response.status, data: ok ? result.data.data : [] });
            return ok ? result.data.data : [];
        }

        async getNotifications() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/notifications'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('notifications', { ok, status: result.response.status, data: ok ? result.data.data : [] });
            return ok ? result.data.data : [];
        }

        async markNotificationRead(notificationId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/notifications/' + encodeURIComponent(String(notificationId)) + '/read'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('notificationRead', { ok, status: result.response.status });
            return ok;
        }

        async getUnreadNotificationCount() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/notifications/unread-count'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('unreadNotificationCount', { ok, status: result.response.status, data: ok ? result.data.data : null });
            return ok ? result.data.data : null;
        }

        async markAllNotificationsRead() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/notifications/read-all'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('notificationsAllRead', { ok, status: result.response.status });
            return ok;
        }

        async getFriendRequests() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/friends/requests'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('friendRequests', { ok, status: result.response.status, data: ok ? result.data.data : [] });
            return ok ? result.data.data : [];
        }

        async getProfile() {
            if (!this.sessionToken) throw new Error('Not logged in');
            const result = await this._request(this._url('/profile'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('profile', { ok, status: result.response.status, data: ok ? result.data.data : null });
            return ok ? result.data.data : null;
        }

        async updateProfile(name, bio, location, website) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = {
                name: name || null,
                bio: bio || null,
                location: location || null,
                website: website || null
            };
            const result = await this._request(this._url('/profile'), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'Profile updated successfully.';
            this.emit('profileUpdate', { ok, status: result.response.status });
            return ok;
        }

        async uploadAvatar(file) {
            if (!this.sessionToken) throw new Error('Not logged in');
            if (!file) throw new Error('Avatar file is required');
            const formData = new FormData();
            formData.append('avatar', file);
            const result = await this._request(this._url('/profile/avatar'), {
                method: 'POST',
                body: formData
            });
            const ok = result.response.ok && result.data && result.data.result === 'Avatar uploaded successfully.';
            this.emit('avatarUpload', { ok, status: result.response.status, data: ok ? result.data.data : null });
            return ok ? result.data.data : null;
        }

        async triggerAchievement(gameId, description, points, iconId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = {
                token: this.sessionToken,
                game_id: String(gameId),
                description: String(description),
                points: Number(points),
                icon_id: String(iconId)
            };
            const result = await this._request(this._url('/achievements/trigger'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('achievementTrigger', { ok, status: result.response.status, data: ok ? result.data.data : null });
            return ok ? result.data.data : null;
        }

        async getAchievements(gameId) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const url = gameId ? this._url('/achievements/' + encodeURIComponent(String(gameId))) : this._url('/achievements');
            const result = await this._request(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('achievements', { ok, status: result.response.status, data: ok ? result.data.data : [] });
            return ok ? result.data.data : [];
        }

        async registerDeveloper(name, description, members) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = {
                token: this.sessionToken,
                name: String(name),
                description: String(description),
                members: JSON.parse(String(members || '[]'))
            };
            const result = await this._request(this._url('/developer/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('developerRegister', { ok, status: result.response.status, data: ok ? result.data.data : null });
            return ok ? result.data.data : null;
        }

        async registerGame(developerId, name, description, features) {
            if (!this.sessionToken) throw new Error('Not logged in');
            const payload = {
                token: this.sessionToken,
                developerid: String(developerId),
                name: String(name),
                description: String(description),
                features: JSON.parse(String(features || '[]'))
            };
            const result = await this._request(this._url('/developer/newgame'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const ok = result.response.ok && result.data && result.data.result === 'OK';
            this.emit('gameRegister', { ok, status: result.response.status, data: ok ? result.data.data : null });
            return ok ? result.data.data : null;
        }
    }

    root.OmegaBrowser = OmegaBrowser;
})(window);
