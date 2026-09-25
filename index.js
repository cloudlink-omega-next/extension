/*

CloudLink Ω Next API extension for Scratch 3

Copyright (C) 2025 Mike Renaker "MikeDEV".

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function (Scratch) {
    // Define class for authentication
    class OmegaAuth {
        constructor() {
            const base = window.location.origin === 'null' ? '' : window.location.origin;
            this.rootApiURL = base + "/api/v1";
            this.rootWsURL = base.replace("http", "ws") + "/signaling";
            this.rootAuthURL = base + "/accounts/api/v0";
            this.rootAuthV1URL = base + "/accounts/api/v1";
            this.rootApiV1URL = base + "/api/v1";
            this.selectedUgi = "01HNPHRWS0N0AYMM5K4HN31V4W"; // Default UGI
            this.registerSuccess = false;
            this.loginSuccess = false;
            this.saveSuccess = false;
            this.loadSuccess = false;
            this.verifySuccess = false;
            this.resendSuccess = false;
            this.searchSuccess = false;
            this.friendRequestSuccess = false;
            this.acceptSuccess = false;
            this.rejectSuccess = false;
            this.cancelSuccess = false;
            this.friendsSuccess = false;
            this.removeSuccess = false;
            this.messageSuccess = false;
            this.messagesLoaded = "";
            this.blockSuccess = false;
            this.unblockSuccess = false;
            this.blocklistSuccess = false;
            this.logoutSuccess = false;
            this.validateSuccess = false;
            this.resetPasswordSuccess = false;
            this.usernameCheckSuccess = false;
            this.totpEnrollSuccess = false;
            this.totpVerifySuccess = false;
            this.recoverySentSuccess = false;
        this.recoveryConfirmedSuccess = false;
        this.changePasswordSuccess = false;
        this.changeEmailSuccess = false;
        this.confirmEmailChangeSuccess = false;
        this.disableTotpSuccess = false;
        this.regenerateRecoverySuccess = false;
        this.recoveryCodesData = "[]";
        this.registerDeveloperSuccess = false;
        this.registerGameSuccess = false;
        this.achievementTriggerSuccess = false;
        this.achievementTriggeredData = "";
        this.achievementsLoaded = false;
        this.achievementsList = '[]';
        this.profileLoaded = false;
        this.profileUpdated = false;
        this.avatarUploaded = false;
        this.profileData = "null";
        this.profileUpdateSuccess = false;
        this.avatarUploadSuccess = false;
        this.avatarURL = "";
            this.notificationsLoaded = "";
            this.notificationsSuccess = false;
            this.notificationReadSuccess = false;
            this.sessionToken = new String();
            this.statusCodes = {
                register: "",
                login: "",
                load: "",
                save: "",
                verify: "",
                resend: "",
                search: "",
                friend_request: "",
                accept_request: "",
                reject_request: "",
                cancel_request: "",
                get_friends: "",
                remove_friend: "",
                send_message: "",
                get_messages: "",
                block: "",
                unblock: "",
                get_blocklist: "",
                get_notifications: "",
                mark_notification_read: "",
                logout: "",
                validate: "",
                reset_password: "",
                check_username: "",
                totp_enroll: "",
                totp_verify: "",
                send_recovery: "",
                confirm_recovery: "",
                change_password: "",
                change_email: "",
                confirm_email_change: "",
                disable_totp: "",
                regenerate_recovery_codes: "",
                register_developer: "",
                register_game: "",
                achievement_trigger: "",
                get_achievements: "",
                get_profile: "",
                update_profile: "",
                upload_avatar: ""
            }
            this.loadedData = "";
            this.validatedData = "null";
            this.totpEnrollData = "null";
            this.totpVerifyData = "null";
            this.registerDeveloperId = "null";
            this.registerGameId = "null";
        }

        async Login(email, password, totp) {
            try {
                const response = await fetch(`${this.rootAuthURL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        totp
                    }),
                });

                const data = await response.text(); // text/plain response. Should be just "OK".
                if (response.ok) {
                    console.log("账户登录成功。");
                    this.sessionToken = data;

                } else {
                    console.warn("账户登录失败：", data);
                }
                this.loginSuccess = response.ok;
                this.statusCodes.login = response.status;
            } catch (error) {
                console.error('Error getting login token:', error);
            }
        }

        async GuestLogin(username) {
            if (username == "") {
                console.warn("访客登录失败：未提供用户名。");
                this.loginSuccess = false;
                this.statusCodes.login = "400";
                return;
            }

            try {
                const response = await fetch(`${this.rootAuthURL}/guest-login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                    }),
                });

                const data = await response.text(); // text/plain response. Should be just "OK".
                if (response.ok) {
                    console.log("访客账户登录成功。");
                    this.sessionToken = data;

                } else {
                    console.warn("访客登录失败：", data);
                }
                this.loginSuccess = response.ok;
                this.statusCodes.login = response.status;
            } catch (error) {
                console.error('Error getting guest login token:', error);
            }
        }

        async Save(save_slot, save_data) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: this.sessionToken,
                        ugi: this.selectedUgi,
                        save_slot,
                        save_data,
                    }),
                });

                const data = await response.text(); // text/plain response. Should be just "OK".
                if (response.ok) {
                    console.log("数据保存成功。");
                } else {
                    console.warn("保存失败：", data);
                }
                this.saveSuccess = response.ok;
                this.statusCodes.save = response.status;
            } catch (error) {
                console.error('Error saving data:', error);
            }
        }

        async Load(save_slot) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/load`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: this.sessionToken,
                        ugi: this.selectedUgi,
                        save_slot,
                    }),
                });

                const data = await response.text(); // text/plain response. Should be just "OK".
                if (response.ok) {
                    console.log("数据加载成功。");
                    this.loadedData = data;
                } else {
                    console.warn("加载失败：", data);
                }
                this.loadSuccess = response.ok;
                this.statusCodes.load = response.status;
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }

        async Register(email, username, password) {
            try {
                const response = await fetch(`${this.rootAuthURL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        username,
                        password,
                    }),
                });

                const data = await response.text(); // text/plain response. Should be just "OK".
                if (data == 'OK' || data == "OK; Email verification disabled") {
                    console.log("账户注册成功。");
                    this.registerSuccess = true;
                } else {
                    console.warn("账户注册失败：", data);
                    this.registerSuccess = false;
                }
                this.statusCodes.register = response.status;
            } catch (error) {
                console.error('Error getting response:', error);
                this.registerSuccess = false;
            }
        }

        async Verify(code) {
            try {
                const response = await fetch(`${this.rootAuthURL}/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: this.sessionToken,
                        code,
                    }),
                });

                const data = await response.text(); // text/plain response. Should be just "OK".
                if (data == 'OK') {
                    console.log("邮箱验证成功。");
                    
                } else {
                    console.warn("邮箱验证失败：", data);
                }
                this.verifySuccess = (data == 'OK');
                this.statusCodes.verify = response.status;
            } catch (error) {
                console.error('Error getting response:', error);
                this.verifySuccess = false;
            }
        }

        async ResendVerify() {
            try {
                const response = await fetch(`${this.rootAuthURL}/resend-verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: this.sessionToken,
                    }),
                });
                const data = await response.text(); // text/plain response. Should be just "OK".
                if (data == 'OK') {
                    console.log("已成功重新发送邮箱验证。");
                    
                } else {
                    console.warn("重新发送邮箱验证失败：", data);
                }
                this.resendSuccess = (data == 'OK');
                this.statusCodes.resend = response.status;
            } catch (error) {
                console.error('Error getting response:', error);
                this.resendSuccess = false;
            }
        }

        async SearchUsers(query) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/search?q=${encodeURIComponent(query)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok && data.result === 'OK') {
                    this.searchResults = JSON.stringify(data.data);
                    console.log('搜索用户成功。');
                } else {
                    this.searchResults = '[]';
                    console.warn('搜索用户失败：', data.result);
                }
                this.searchSuccess = response.ok;
                this.statusCodes.search = response.status;
            } catch (error) {
                console.error('Error searching users:', error);
                this.searchSuccess = false;
                this.searchResults = '[]';
            }
        }

        async SendFriendRequest(receiverId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/request`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: this.sessionToken,
                        receiver_id: receiverId,
                    }),
                });

                const data = await response.json();
                this.friendRequestSuccess = response.ok && data.result === 'OK';
                this.statusCodes.friend_request = response.status;
                if (!this.friendRequestSuccess) {
                    console.warn('发送好友请求失败：', data.result);
                }
            } catch (error) {
                console.error('Error sending friend request:', error);
                this.friendRequestSuccess = false;
            }
        }

        async AcceptFriendRequest(requestId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/request/${requestId}/accept`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();
                this.acceptSuccess = response.ok && data.result === 'OK';
                this.statusCodes.accept_request = response.status;
                if (!this.acceptSuccess) {
                    console.warn('接受好友请求失败：', data.result);
                }
            } catch (error) {
                console.error('Error accepting friend request:', error);
                this.acceptSuccess = false;
            }
        }

        async RejectFriendRequest(requestId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/request/${requestId}/reject`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();
                this.rejectSuccess = response.ok && data.result === 'OK';
                this.statusCodes.reject_request = response.status;
                if (!this.rejectSuccess) {
                    console.warn('拒绝好友请求失败：', data.result);
                }
            } catch (error) {
                console.error('Error rejecting friend request:', error);
                this.rejectSuccess = false;
            }
        }

        async CancelFriendRequest(requestId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/request/${requestId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();
                this.cancelSuccess = response.ok && data.result === 'OK';
                this.statusCodes.cancel_request = response.status;
                if (!this.cancelSuccess) {
                    console.warn('取消好友请求失败：', data.result);
                }
            } catch (error) {
                console.error('Error canceling friend request:', error);
                this.cancelSuccess = false;
            }
        }

        async GetFriends() {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok && data.result === 'OK') {
                    this.friendsList = JSON.stringify(data.data);
                    console.log('获取好友列表成功。');
                } else {
                    this.friendsList = '[]';
                    console.warn('获取好友列表失败：', data.result);
                }
                this.friendsSuccess = response.ok;
                this.statusCodes.get_friends = response.status;
            } catch (error) {
                console.error('Error getting friends:', error);
                this.friendsSuccess = false;
                this.friendsList = '[]';
            }
        }

        async GetFriendRequests() {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/requests`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok && data.result === 'OK') {
                    this.friendRequests = JSON.stringify(data.data);
                console.log('获取好友请求成功。');
            } else {
                this.friendRequests = '[]';
                console.warn('获取好友请求失败：', data.result);
            }
            this.friendRequestSuccess = response.ok;
            this.statusCodes.get_friend_requests = response.status;
        } catch (error) {
            console.error('Error getting friend requests:', error);
            this.friendRequestSuccess = false;
            this.friendRequests = '[]';
        }
    }

    async RemoveFriend(friendId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/${friendId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();
                this.removeSuccess = response.ok && data.result === 'OK';
                this.statusCodes.remove_friend = response.status;
                if (!this.removeSuccess) {
                    console.warn('删除好友失败：', data.result);
                }
            } catch (error) {
                console.error('Error removing friend:', error);
                this.removeSuccess = false;
            }
        }

        async SendMessage(receiverId, content) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/${receiverId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        receiver_id: receiverId,
                        content: content,
                    }),
                });

                const data = await response.json();
                this.messageSuccess = response.ok && data.result === 'OK';
                this.statusCodes.send_message = response.status;
                if (!this.messageSuccess) {
                    console.warn('发送消息失败：', data.result);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                this.messageSuccess = false;
            }
        }

        async GetMessages(userId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/${userId}/messages`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok && data.result === 'OK') {
                    this.messagesLoaded = JSON.stringify(data.data);
                    console.log('获取消息成功。');
                } else {
                    this.messagesLoaded = '[]';
                    console.warn('获取消息失败：', data.result);
                }
                this.messageSuccess = response.ok;
                this.statusCodes.get_messages = response.status;
            } catch (error) {
                console.error('Error getting messages:', error);
                this.messageSuccess = false;
                this.messagesLoaded = '[]';
            }
        }

        async BlockUser(blockedId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/block`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        blocked_id: blockedId,
                    }),
                });

                const data = await response.json();
                this.blockSuccess = response.ok && data.result === 'OK';
                this.statusCodes.block = response.status;
                if (!this.blockSuccess) {
                    console.warn('拉黑用户失败：', data.result);
                }
            } catch (error) {
                console.error('Error blocking user:', error);
                this.blockSuccess = false;
            }
        }

        async UnblockUser(blockedId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/unblock`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        blocked_id: blockedId,
                    }),
                });

                const data = await response.json();
                this.unblockSuccess = response.ok && data.result === 'OK';
                this.statusCodes.unblock = response.status;
                if (!this.unblockSuccess) {
                    console.warn('取消拉黑失败：', data.result);
                }
            } catch (error) {
                console.error('Error unblocking user:', error);
                this.unblockSuccess = false;
            }
        }

        async GetBlocklist() {
            try {
                const response = await fetch(`${this.rootApiV1URL}/friends/blocklist`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok && data.result === 'OK') {
                    this.blocklistResults = JSON.stringify(data.data);
                    console.log('获取黑名单成功。');
                } else {
                    this.blocklistResults = '[]';
                    console.warn('获取黑名单失败：', data.result);
                }
                this.blocklistSuccess = response.ok;
                this.statusCodes.get_blocklist = response.status;
            } catch (error) {
                console.error('Error getting blocklist:', error);
                this.blocklistSuccess = false;
                this.blocklistResults = '[]';
            }
        }

        async GetNotifications() {
            try {
                const response = await fetch(`${this.rootApiV1URL}/notifications`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok && data.result === 'OK') {
                    this.notificationsLoaded = JSON.stringify(data.data);
                    console.log('获取通知成功。');
                } else {
                    this.notificationsLoaded = '[]';
                    console.warn('获取通知失败：', data.result);
                }
                this.notificationsSuccess = response.ok;
                this.statusCodes.get_notifications = response.status;
            } catch (error) {
                console.error('Error getting notifications:', error);
                this.notificationsSuccess = false;
                this.notificationsLoaded = '[]';
            }
        }

        async MarkNotificationRead(notificationId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/notifications/${notificationId}/read`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();
                this.notificationReadSuccess = response.ok && data.result === 'OK';
                this.statusCodes.mark_notification_read = response.status;
                if (!this.notificationReadSuccess) {
                    console.warn('标记通知已读失败：', data.result);
                }
            } catch (error) {
                console.error('Error marking notification read:', error);
                this.notificationReadSuccess = false;
            }
        }

        async GetUnreadNotificationCount() {
            try {
                const response = await fetch(`${this.rootApiV1URL}/notifications/unread-count`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok && data.result === 'OK') {
                    this.unreadNotificationCount = JSON.stringify(data.data);
                    console.log('获取未读通知数成功。');
                } else {
                    this.unreadNotificationCount = '{"count":0}';
                    console.warn('获取未读通知数失败：', data.result);
                }
                this.unreadCountSuccess = response.ok;
                this.statusCodes.unread_notification_count = response.status;
            } catch (error) {
                console.error('Error getting unread notification count:', error);
                this.unreadCountSuccess = false;
                this.unreadNotificationCount = '{"count":0}';
            }
        }

        async MarkAllNotificationsRead() {
            try {
                const response = await fetch(`${this.rootApiV1URL}/notifications/read-all`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();
                this.markAllReadSuccess = response.ok && data.result === 'OK';
                this.statusCodes.mark_all_notifications_read = response.status;
                if (!this.markAllReadSuccess) {
                    console.warn('全部标记已读失败：', data.result);
                }
            } catch (error) {
                console.error('Error marking all notifications read:', error);
                this.markAllReadSuccess = false;
            }
        }

        async Logout() {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/logout`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                this.logoutSuccess = response.ok && data.result === 'OK';
                this.statusCodes.logout = response.status;
                if (!this.logoutSuccess) {
                    console.warn('登出失败：', data.result);
                }
            } catch (error) {
                console.error('Error logging out:', error);
                this.logoutSuccess = false;
            }
        }

        async Validate() {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/validate`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                this.validateSuccess = response.ok && data.result === 'OK';
                this.statusCodes.validate = response.status;
                if (this.validateSuccess) {
                    this.validatedData = JSON.stringify(data.data);
                    console.log('令牌验证成功。');
                } else {
                    this.validatedData = 'null';
                    console.warn('令牌验证失败：', data.result);
                }
            } catch (error) {
                console.error('Error validating token:', error);
                this.validateSuccess = false;
                this.validatedData = 'null';
            }
        }

        async ResetPassword(password) {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: password,
                    }),
                });

                const data = await response.json();
                this.resetPasswordSuccess = response.ok && data.result === 'OK';
                this.statusCodes.reset_password = response.status;
                if (!this.resetPasswordSuccess) {
                    console.warn('重置密码失败：', data.result);
                }
            } catch (error) {
                console.error('Error resetting password:', error);
                this.resetPasswordSuccess = false;
            }
        }

        async CheckUsername(username) {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                    }),
                });

                const data = await response.json();
                this.usernameCheckSuccess = response.ok && data.result === 'Username available.';
                this.statusCodes.check_username = response.status;
                if (!this.usernameCheckSuccess) {
                    console.warn('用户名检查失败：', data.result);
                }
            } catch (error) {
                console.error('Error checking username:', error);
                this.usernameCheckSuccess = false;
            }
        }

        async BeginTotpEnrollment() {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/begin-totp-enrollment`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                this.totpEnrollSuccess = response.ok && data.result === 'OK';
                this.statusCodes.totp_enroll = response.status;
                if (this.totpEnrollSuccess) {
                    this.totpEnrollData = JSON.stringify(data.data);
                    console.log('开始 TOTP 注册成功。');
                } else {
                    this.totpEnrollData = 'null';
                    console.warn('开始 TOTP 注册失败：', data.result);
                }
            } catch (error) {
                console.error('Error beginning TOTP enrollment:', error);
                this.totpEnrollSuccess = false;
                this.totpEnrollData = 'null';
            }
        }

        async VerifyTotpEnrollment(code) {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/verify-totp-enrollment?code=${encodeURIComponent(code)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                this.totpVerifySuccess = response.ok && data.result === 'OK';
                this.statusCodes.totp_verify = response.status;
                if (this.totpVerifySuccess) {
                    this.totpVerifyData = JSON.stringify(data.data);
                    console.log('验证 TOTP 注册成功。');
                } else {
                    this.totpVerifyData = 'null';
                    console.warn('验证 TOTP 注册失败：', data.result);
                }
            } catch (error) {
                console.error('Error verifying TOTP enrollment:', error);
                this.totpVerifySuccess = false;
                this.totpVerifyData = 'null';
            }
        }

        async SendRecovery(email) {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/send-recovery`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                    }),
                });

                const data = await response.json();
                this.recoverySentSuccess = response.ok && data.result === 'OK';
                this.statusCodes.send_recovery = response.status;
                if (!this.recoverySentSuccess) {
                    console.warn('发送恢复邮件失败：', data.result);
                }
            } catch (error) {
                console.error('Error sending recovery email:', error);
                this.recoverySentSuccess = false;
            }
        }

        async ConfirmRecovery(email, code, totp, backupCode) {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/confirm-recovery`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        code: code,
                        totp: totp,
                        backup_code: backupCode,
                    }),
                });

                const data = await response.json();
                this.recoveryConfirmedSuccess = response.ok && data.result === 'OK';
                this.statusCodes.confirm_recovery = response.status;
                if (!this.recoveryConfirmedSuccess) {
                    console.warn('确认恢复失败：', data.result);
                }
            } catch (error) {
                console.error('Error confirming recovery:', error);
                this.recoveryConfirmedSuccess = false;
            }
        }

        async ChangePassword(currentPassword, newPassword) {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/change-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword,
                    }),
                });

                const data = await response.json();
                this.changePasswordSuccess = response.ok && data.result === 'Password changed successfully.';
                this.statusCodes.change_password = response.status;
                if (!this.changePasswordSuccess) {
                    console.warn('更改密码失败：', data.result);
                }
            } catch (error) {
                console.error('Error changing password:', error);
                this.changePasswordSuccess = false;
            }
        }

        async ChangeEmail(password, newEmail) {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/change-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: password,
                        new_email: newEmail,
                    }),
                });

                const data = await response.json();
                this.changeEmailSuccess = response.ok && data.result === 'OK';
                this.statusCodes.change_email = response.status;
                if (!this.changeEmailSuccess) {
                    console.warn('更改邮箱失败：', data.result);
                }
            } catch (error) {
                console.error('Error changing email:', error);
                this.changeEmailSuccess = false;
            }
        }

        async ConfirmEmailChange(token) {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/confirm-email-change?token=${encodeURIComponent(token)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                this.confirmEmailChangeSuccess = response.ok && data.result === 'OK';
                this.statusCodes.confirm_email_change = response.status;
                if (!this.confirmEmailChangeSuccess) {
                    console.warn('确认邮箱更改失败：', data.result);
                }
            } catch (error) {
                console.error('Error confirming email change:', error);
                this.confirmEmailChangeSuccess = false;
            }
        }

        async DisableTotp(backupCode) {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/disable-totp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        backup_code: backupCode,
                    }),
                });

                const data = await response.json();
                this.disableTotpSuccess = response.ok && data.result === 'TOTP disabled successfully.';
                this.statusCodes.disable_totp = response.status;
                if (!this.disableTotpSuccess) {
                    console.warn('禁用 TOTP 失败：', data.result);
                }
            } catch (error) {
                console.error('Error disabling TOTP:', error);
                this.disableTotpSuccess = false;
            }
        }

        async RegenerateRecoveryCodes() {
            try {
                const response = await fetch(`${this.rootAuthV1URL}/regenerate-recovery-codes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();
                this.regenerateRecoverySuccess = response.ok && data.result === 'OK';
                this.statusCodes.regenerate_recovery_codes = response.status;
                if (this.regenerateRecoverySuccess && data.data && data.data.recovery_codes) {
                    this.recoveryCodesData = JSON.stringify(data.data.recovery_codes);
                    console.log('重新生成恢复码成功。');
                } else {
                    this.recoveryCodesData = '[]';
                    console.warn('重新生成恢复码失败：', data.result);
                }
            } catch (error) {
                console.error('Error regenerating recovery codes:', error);
                this.regenerateRecoverySuccess = false;
                this.recoveryCodesData = '[]';
            }
        }

        async RegisterDeveloper(name, description, members) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/developer/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        members: JSON.parse(members),
                    }),
                });

                const data = await response.json();
                this.registerDeveloperSuccess = response.ok && data.result === 'OK';
                this.statusCodes.register_developer = response.status;
                if (this.registerDeveloperSuccess) {
                    this.registerDeveloperId = JSON.stringify(data.data);
                    console.log('注册开发者成功。');
                } else {
                    this.registerDeveloperId = 'null';
                    console.warn('注册开发者失败：', data.result);
                }
            } catch (error) {
                console.error('Error registering developer:', error);
                this.registerDeveloperSuccess = false;
                this.registerDeveloperId = 'null';
            }
        }

        async RegisterGame(developerId, name, description, features) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/developer/newgame`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        developerid: developerId,
                        name: name,
                        description: description,
                        features: JSON.parse(features),
                    }),
                });

                const data = await response.json();
                this.registerGameSuccess = response.ok && data.result === 'OK';
                this.statusCodes.register_game = response.status;
                if (this.registerGameSuccess) {
                    this.registerGameId = JSON.stringify(data.data);
                    console.log('注册游戏成功。');
                } else {
                    this.registerGameId = 'null';
                    console.warn('注册游戏失败：', data.result);
                }
            } catch (error) {
                console.error('Error registering game:', error);
                this.registerGameSuccess = false;
                this.registerGameId = 'null';
            }
        }

        async TriggerAchievement(gameId, description, points, iconId) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/achievements/trigger`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        game_id: gameId,
                        description: description,
                        points: points,
                        icon_id: iconId,
                    }),
                });

                const data = await response.json();
                this.achievementTriggerSuccess = response.ok && data.result === 'OK';
                this.statusCodes.achievement_trigger = response.status;
                if (this.achievementTriggerSuccess) {
                    this.achievementTriggeredData = JSON.stringify(data.data);
                    console.log('触发成就成功。');
                } else {
                    this.achievementTriggeredData = 'null';
                    console.warn('触发成就失败：', data.result);
                }
            } catch (error) {
                console.error('Error triggering achievement:', error);
                this.achievementTriggerSuccess = false;
                this.achievementTriggeredData = 'null';
            }
        }

        async GetAchievements(gameId) {
            try {
                const url = gameId
                    ? `${this.rootApiV1URL}/achievements/${encodeURIComponent(gameId)}`
                    : `${this.rootApiV1URL}/achievements`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                this.achievementsLoaded = response.ok && data.result === 'OK';
                this.statusCodes.get_achievements = response.status;
                if (this.achievementsLoaded) {
                    this.achievementsList = JSON.stringify(data.data);
                    console.log('获取成就列表成功。');
                } else {
                    this.achievementsList = '[]';
                    console.warn('获取成就列表失败：', data.result);
                }
            } catch (error) {
                console.error('Error getting achievements:', error);
                this.achievementsLoaded = false;
                this.achievementsList = '[]';
            }
        }

        async GetProfile() {
            try {
                const response = await fetch(`${this.rootApiV1URL}/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                this.profileLoaded = response.ok && data.result === 'OK';
                this.statusCodes.get_profile = response.status;
                if (this.profileLoaded) {
                    this.profileData = JSON.stringify(data.data);
                    if (data.data && data.data.avatar && data.data.avatar.link) {
                        this.avatarURL = data.data.avatar.link;
                    }
                    console.log('获取个人资料成功。');
                } else {
                    this.profileData = 'null';
                    console.warn('获取个人资料失败：', data.result);
                }
            } catch (error) {
                console.error('Error getting profile:', error);
                this.profileLoaded = false;
                this.profileData = 'null';
            }
        }

        async UpdateProfile(name, bio, location, website) {
            try {
                const response = await fetch(`${this.rootApiV1URL}/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name || null,
                        bio: bio || null,
                        location: location || null,
                        website: website || null,
                    }),
                });

                const data = await response.json();
                this.profileUpdated = response.ok && data.result === 'Profile updated successfully.';
                this.statusCodes.update_profile = response.status;
                if (!this.profileUpdated) {
                    console.warn('更新个人资料失败：', data.result);
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                this.profileUpdated = false;
            }
        }

        async UploadAvatar(file) {
            try {
                if (!file) {
                    console.warn('未提供头像文件。');
                    this.avatarUploadSuccess = false;
                    this.statusCodes.upload_avatar = '400';
                    return;
                }

                const image = new Image();
                const imageURL = URL.createObjectURL(file);

                await new Promise((resolve, reject) => {
                    image.onload = () => {
                        URL.revokeObjectURL(imageURL);
                        resolve();
                    };
                    image.onerror = () => {
                        URL.revokeObjectURL(imageURL);
                        reject(new Error('无法加载图片。'));
                    };
                    image.src = imageURL;
                });

                if (image.width < 128 || image.height < 128) {
                    console.warn('头像尺寸太小，最小尺寸为 128x128。');
                    this.avatarUploadSuccess = false;
                    this.statusCodes.upload_avatar = '400';
                    return;
                }

                if (image.width > 4096 || image.height > 4096) {
                    console.warn('头像尺寸太大，最大尺寸为 4096x4096。');
                    this.avatarUploadSuccess = false;
                    this.statusCodes.upload_avatar = '400';
                    return;
                }

                const formData = new FormData();
                formData.append('avatar', file);

                const response = await fetch(`${this.rootApiV1URL}/profile/avatar`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                this.avatarUploadSuccess = response.ok && data.result === 'Avatar uploaded successfully.';
                this.statusCodes.upload_avatar = response.status;
                if (this.avatarUploadSuccess) {
                    this.avatarURL = data.data.avatar_url || '';
                    console.log('头像上传成功。');
                } else {
                    console.warn('头像上传失败：', data.result);
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                this.avatarUploadSuccess = false;
                this.statusCodes.upload_avatar = '500';
            }
        }
    }

    // Initialize class for the extension
    const OmegaAuthInstance = new OmegaAuth();

    // Define the extension for the CLΩ service
    class CloudlinkOmegaNext {
        constructor(Scratch) {
            this.vm = Scratch.vm; // VM
            this.runtime = Scratch.vm.runtime; // Runtime

            // Define icons
            this.blockIconURI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc3IiBoZWlnaHQ9IjEyMyIgdmlld0JveD0iMCAwIDE3NyAxMjMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xXzUzKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTM0LjMyIDM4LjUxMjlDMTU3LjU2MSAzOC41MTI5IDE3Ni4zOTkgNTcuMzUyMyAxNzYuMzk5IDgwLjU5MThDMTc2LjM5OSAxMDMuODMxIDE1Ny41NjEgMTIyLjY3MSAxMzQuMzIgMTIyLjY3MUg0Mi4wNzg5QzE4LjgzOCAxMjIuNjcxIDAgMTAzLjgzMSAwIDgwLjU5MThDMCA1Ny4zNTIzIDE4LjgzOCAzOC41MTI5IDQyLjA3ODkgMzguNTEyOUg0Ni4yNjc4QzQ4LjA3OTMgMTYuOTQyMyA2Ni4xNjEzIDAgODguMTk5MyAwQzExMC4yMzcgMCAxMjguMzE5IDE2Ljk0MjMgMTMwLjEzMSAzOC41MTI5SDEzNC4zMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMTcuMjc4IDk4Ljk3MDNDMTE3LjI3OCAxMDEuMzY0IDExNS4zMzggMTAzLjMwNCAxMTIuOTQ0IDEwMy4zMDRIOTcuNTQ4MkM5NS4xNTQ5IDEwMy4zMDQgOTMuMjE0OCAxMDEuMzY0IDkzLjIxNDggOTguOTcwM1Y4OS42MTU4QzkzLjIxNDggODcuOTQwOCA5NC4xODAzIDg2LjQxNTkgOTUuNjk0MiA4NS42OTkxQzEwMS41ODUgODIuOTExIDEwNS4zOTEgNzYuOTAxMyAxMDUuMzkxIDcwLjM4ODlDMTA1LjM5MSA2MS4wNTQ2IDk3Ljc5NjcgNTMuNDYwNCA4OC40NjIyIDUzLjQ2MDRDNzkuMTI3NyA1My40NjA0IDcxLjUzMzcgNjEuMDU0NiA3MS41MzM3IDcwLjM4ODlDNzEuNTMzNyA3Ni45MDE1IDc1LjMzOTkgODIuOTExIDgxLjIzMDUgODUuNjk5MUM4Mi43NDQ1IDg2LjQxNTYgODMuNzEgODcuOTQwNiA4My43MSA4OS42MTU4Vjk4Ljk3MDNDODMuNzEgMTAxLjM2NCA4MS43NyAxMDMuMzA0IDc5LjM3NjYgMTAzLjMwNEg2My45ODAyQzYxLjU4NjkgMTAzLjMwNCA1OS42NDY4IDEwMS4zNjQgNTkuNjQ2OCA5OC45NzAzQzU5LjY0NjggOTYuNTc3IDYxLjU4NjkgOTQuNjM2OSA2My45ODAyIDk0LjYzNjlINzUuMDQzM1Y5Mi4xODc1QzcxLjgwMDIgOTAuMTg5NCA2OS4wMzQyIDg3LjQ4NzcgNjYuOTQ5NiA4NC4yNjA3QzY0LjI3ODcgODAuMTI2MiA2Mi44NjY5IDc1LjMyOTYgNjIuODY2OSA3MC4zODg5QzYyLjg2NjkgNTYuMjc1NSA3NC4zNDg5IDQ0Ljc5MzYgODguNDYyMiA0NC43OTM2QzEwMi41NzYgNDQuNzkzNiAxMTQuMDU4IDU2LjI3NTUgMTE0LjA1OCA3MC4zODg3QzExNC4wNTggNzUuMzI5NCAxMTIuNjQ2IDgwLjEyNjIgMTA5Ljk3NSA4NC4yNjA1QzEwNy44OTEgODcuNDg3NSAxMDUuMTI1IDkwLjE4OTQgMTAxLjg4MiA5Mi4xODc1Vjk0LjYzNjlIMTEyLjk0NEMxMTUuMzM4IDk0LjYzNjkgMTE3LjI3OCA5Ni41NzcgMTE3LjI3OCA5OC45NzAzWiIgZmlsbD0iI0ZGNEQ0QyIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzFfNTMiPgo8cmVjdCB3aWR0aD0iMTc2LjM5OSIgaGVpZ2h0PSIxMjIuNjcxIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";

            // Define menu icon
            this.menuIconURI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI2IiBoZWlnaHQ9IjIyNiIgdmlld0JveD0iMCAwIDIyNiAyMjYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xXzIpIj4KPHBhdGggZD0iTTAgMTEyLjY3N0MwIDUwLjQ0NzQgNTAuNDQ3NCAwIDExMi42NzcgMEMxNzQuOTA3IDAgMjI1LjM1NSA1MC40NDc0IDIyNS4zNTUgMTEyLjY3N0MyMjUuMzU1IDE3NC45MDcgMTc0LjkwNyAyMjUuMzU1IDExMi42NzcgMjI1LjM1NUM1MC40NDc0IDIyNS4zNTUgMCAxNzQuOTA3IDAgMTEyLjY3N1oiIGZpbGw9IiNGRjRENEMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNTguNTM1IDgzLjc2MTJDMTgxLjc3NiA4My43NjEyIDIwMC42MTQgMTAyLjYwMSAyMDAuNjE0IDEyNS44NEMyMDAuNjE0IDE0OS4wOCAxODEuNzc2IDE2Ny45MTkgMTU4LjUzNSAxNjcuOTE5SDY2LjI5NDFDNDMuMDUzMiAxNjcuOTE5IDI0LjIxNTIgMTQ5LjA4IDI0LjIxNTIgMTI1Ljg0QzI0LjIxNTIgMTAyLjYwMSA0My4wNTMyIDgzLjc2MTIgNjYuMjk0MSA4My43NjEySDcwLjQ4M0M3Mi4yOTQ1IDYyLjE5MDcgOTAuMzc2NSA0NS4yNDg0IDExMi40MTQgNDUuMjQ4NEMxMzQuNDUyIDQ1LjI0ODQgMTUyLjUzNCA2Mi4xOTA3IDE1NC4zNDYgODMuNzYxMkgxNTguNTM1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE0MS40OTMgMTQ0LjIxOUMxNDEuNDkzIDE0Ni42MTIgMTM5LjU1MyAxNDguNTUyIDEzNy4xNTkgMTQ4LjU1MkgxMjEuNzYzQzExOS4zNyAxNDguNTUyIDExNy40MyAxNDYuNjEyIDExNy40MyAxNDQuMjE5VjEzNC44NjRDMTE3LjQzIDEzMy4xODkgMTE4LjM5NSAxMzEuNjY0IDExOS45MDkgMTMwLjk0N0MxMjUuOCAxMjguMTU5IDEyOS42MDYgMTIyLjE1IDEyOS42MDYgMTE1LjYzN0MxMjkuNjA2IDEwNi4zMDMgMTIyLjAxMiA5OC43MDg3IDExMi42NzcgOTguNzA4N0MxMDMuMzQzIDk4LjcwODcgOTUuNzQ4OSAxMDYuMzAzIDk1Ljc0ODkgMTE1LjYzN0M5NS43NDg5IDEyMi4xNSA5OS41NTUxIDEyOC4xNTkgMTA1LjQ0NiAxMzAuOTQ3QzEwNi45NiAxMzEuNjY0IDEwNy45MjUgMTMzLjE4OSAxMDcuOTI1IDEzNC44NjRWMTQ0LjIxOUMxMDcuOTI1IDE0Ni42MTIgMTA1Ljk4NSAxNDguNTUyIDEwMy41OTIgMTQ4LjU1Mkg4OC4xOTU0Qzg1LjgwMiAxNDguNTUyIDgzLjg2MiAxNDYuNjEyIDgzLjg2MiAxNDQuMjE5QzgzLjg2MiAxNDEuODI1IDg1LjgwMiAxMzkuODg1IDg4LjE5NTQgMTM5Ljg4NUg5OS4yNTg1VjEzNy40MzZDOTYuMDE1NCAxMzUuNDM4IDkzLjI0OTQgMTMyLjczNiA5MS4xNjQ4IDEyOS41MDlDODguNDkzOSAxMjUuMzc1IDg3LjA4MjEgMTIwLjU3OCA4Ny4wODIxIDExNS42MzdDODcuMDgyMSAxMDEuNTI0IDk4LjU2NCA5MC4wNDIgMTEyLjY3NyA5MC4wNDJDMTI2Ljc5MSA5MC4wNDIgMTM4LjI3MyAxMDEuNTI0IDEzOC4yNzMgMTE1LjYzN0MxMzguMjczIDEyMC41NzggMTM2Ljg2MSAxMjUuMzc1IDEzNC4xOSAxMjkuNTA5QzEzMi4xMDYgMTMyLjczNiAxMjkuMzQgMTM1LjQzOCAxMjYuMDk3IDEzNy40MzZWMTM5Ljg4NUgxMzcuMTU5QzEzOS41NTMgMTM5Ljg4NSAxNDEuNDkzIDE0MS44MjUgMTQxLjQ5MyAxNDQuMjE5WiIgZmlsbD0iI0ZGNEQ0QyIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzFfMiI+CjxyZWN0IHdpZHRoPSIyMjUuMzU1IiBoZWlnaHQ9IjIyNS4zNTUiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";
        }

        // Define blocks used in the extension
        getInfo() {
            return {
                id: 'clomega',
                name: 'Cloudlink Ω Next',
                docsURI: 'https://github.com/cloudlink-omega-next/extension/wiki/Extension',
                blockIconURI: this.blockIconURI,
                menuIconURI: this.menuIconURI,
                color1: "#FF4D4C",
                color2: "#FF7473",
                color3: "#A13332",
                blocks: [
                    {
                        opcode: 'set_ugi',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('将 [UGI] 设置为唯一游戏 ID (ugi)'),
                        arguments: {
                            UGI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '01HNPHRWS0N0AYMM5K4HN31V4W',
                            },
                        }
                    },
                    {
                        opcode: 'change_api_url',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('对 API 调用使用 [URL]'),
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://cloudlink-omega-next/api/v1',
                            },
                        }
                    },
                    {
                        opcode: 'change_wss_url',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('对游戏服务器使用 [URL]'),
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'wss://cloudlink-omega-next/signaling',
                            },
                        }
                    },
                    {
                        opcode: 'change_auth_url',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('对身份验证使用 [URL]'),
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://cloudlink-omega-next/accounts/api/v0',
                            },
                        }
                    },
                    {
                        opcode: 'build_server_url',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('连接字符串'),
                    },
                    "---",
                    {
                        opcode: 'get_token',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('会话令牌'),
                    },
                    {
                        opcode: 'login_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('登录状态码'),
                    },
                    {
                        opcode: 'was_login_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('登录是否成功？'),
                    },
                    {
                        opcode: 'guest_login',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('以访客身份登录，用户名： [USERNAME]'),
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'login_account',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('使用邮箱登录： [EMAIL] 密码： [PASSWORD] TOTP： [TOTP]'),
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            TOTP: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'register_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('注册状态码'),
                    },
                    {
                        opcode: 'was_register_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('注册是否成功？'),
                    },
                    {
                        opcode: 'register_account',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('使用邮箱注册： [EMAIL] 用户名： [USERNAME] 密码： [PASSWORD]'),
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            }
                        }
                    },
                    "---",
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: Scratch.translate(`请先登录，然后再验证您的邮箱。`),
                    },
                    {
                        opcode: 'verify_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('邮箱验证状态码'),
                    },
                    {
                        opcode: 'was_verify_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('邮箱验证是否成功？'),
                    },
                    {
                        opcode: 'verify_account',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('使用验证码验证邮箱： [CODE]'),
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'resend_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('重新发送邮箱验证状态码'),
                    },
                    {
                        opcode: 'was_resend_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('重新发送邮箱验证码是否成功？'),
                    },
                    {
                        opcode: 'resend_verify',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('重新发送邮箱验证码'),
                    },
                    "---",
                    {
                        opcode: 'save_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('保存状态码'),
                    },
                    {
                        opcode: 'was_save_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('保存是否成功？'),
                    },
                    {
                        opcode: 'save_slot',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('写入保存槽 [SLOT]： [DATA]'),
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "1",
                                menu: "SlotMenu",
                            },
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '要保存的内容',
                            },
                        }
                    },
                    "---",
                    {
                        opcode: 'load_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('加载状态码'),
                    },
                    {
                        opcode: 'was_load_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('加载是否成功？'),
                    },
                    {
                        opcode: 'loaded_slot_data',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('已加载的保存数据'),
                    },
                    {
                        opcode: 'load_slot',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('从保存槽读取 [SLOT]'),
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "1",
                                menu: "SlotMenu",
                            },
                        }
                    },
                    "---",
                    {
                        opcode: 'search_users',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('搜索用户 [QUERY]'),
                        arguments: {
                            QUERY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'search_results',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('搜索结果 (JSON)'),
                    },
                    {
                        opcode: 'was_search_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('搜索是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'send_friend_request',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('发送好友请求给用户 ID： [USER_ID]'),
                        arguments: {
                            USER_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'accept_friend_request',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('接受好友请求 ID： [REQUEST_ID]'),
                        arguments: {
                            REQUEST_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'reject_friend_request',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('拒绝好友请求 ID： [REQUEST_ID]'),
                        arguments: {
                            REQUEST_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'cancel_friend_request',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('取消好友请求 ID： [REQUEST_ID]'),
                        arguments: {
                            REQUEST_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'was_friend_request_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('好友请求是否成功？'),
                    },
                    {
                        opcode: 'was_accept_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('接受请求是否成功？'),
                    },
                    {
                        opcode: 'was_reject_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('拒绝请求是否成功？'),
                    },
                    {
                        opcode: 'was_cancel_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('取消请求是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'get_friends',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('获取好友列表'),
                    },
                    {
                        opcode: 'friends_list',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('好友列表 (JSON)'),
                    },
                    {
                        opcode: 'was_get_friends_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('获取好友是否成功？'),
                    },
                    {
                        opcode: 'remove_friend',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('删除好友 ID： [USER_ID]'),
                        arguments: {
                            USER_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'was_remove_friend_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('删除好友是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'send_message',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('发送消息给用户 ID： [USER_ID] 内容： [CONTENT]'),
                        arguments: {
                            USER_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            CONTENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'get_messages',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('获取与用户 ID [USER_ID] 的聊天记录'),
                        arguments: {
                            USER_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'messages_loaded',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('聊天记录 (JSON)'),
                    },
                    {
                        opcode: 'was_send_message_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('发送消息是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'block_user',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('拉黑用户 ID： [USER_ID]'),
                        arguments: {
                            USER_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'unblock_user',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('取消拉黑用户 ID： [USER_ID]'),
                        arguments: {
                            USER_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'was_block_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('拉黑是否成功？'),
                    },
                    {
                        opcode: 'was_unblock_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('取消拉黑是否成功？'),
                    },
                    {
                        opcode: 'get_blocklist',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('获取黑名单'),
                    },
                    {
                        opcode: 'blocklist_results',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('黑名单 (JSON)'),
                    },
                    {
                        opcode: 'was_get_blocklist_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('获取黑名单是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'get_notifications',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('获取通知'),
                    },
                    {
                        opcode: 'notifications_loaded',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('通知列表 (JSON)'),
                    },
                    {
                        opcode: 'was_get_notifications_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('获取通知是否成功？'),
                    },
                    {
                        opcode: 'mark_notification_read',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('标记通知已读 ID： [NOTIFICATION_ID]'),
                        arguments: {
                            NOTIFICATION_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'was_mark_notification_read_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('标记已读是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'logout',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('登出'),
                    },
                    {
                        opcode: 'logout_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('登出状态码'),
                    },
                    {
                        opcode: 'was_logout_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('登出是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'validate_token',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('验证当前令牌'),
                    },
                    {
                        opcode: 'validate_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('验证状态码'),
                    },
                    {
                        opcode: 'was_validate_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('验证是否成功？'),
                    },
                    {
                        opcode: 'validated_data',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('验证数据 (JSON)'),
                    },
                    "---",
                    {
                        opcode: 'reset_password',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('重置密码为： [PASSWORD]'),
                        arguments: {
                            PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'reset_password_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('重置密码状态码'),
                    },
                    {
                        opcode: 'was_reset_password_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('重置密码是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'check_username',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('检查用户名是否可用： [USERNAME]'),
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'check_username_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('用户名检查状态码'),
                    },
                    {
                        opcode: 'was_username_available',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('用户名是否可用？'),
                    },
                    "---",
                    {
                        opcode: 'begin_totp_enrollment',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('开始 TOTP 双因素认证注册'),
                    },
                    {
                        opcode: 'totp_enroll_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('TOTP 注册状态码'),
                    },
                    {
                        opcode: 'was_totp_enroll_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('TOTP 注册是否成功？'),
                    },
                    {
                        opcode: 'totp_enroll_data',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('TOTP 注册数据 (JSON)'),
                    },
                    "---",
                    {
                        opcode: 'verify_totp_enrollment',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('验证 TOTP 注册码： [CODE]'),
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'totp_verify_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('TOTP 验证状态码'),
                    },
                    {
                        opcode: 'was_totp_verify_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('TOTP 验证是否成功？'),
                    },
                    {
                        opcode: 'totp_verify_data',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('TOTP 验证数据 (JSON)'),
                    },
                    "---",
                    {
                        opcode: 'send_recovery_email',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('发送账户恢复邮件到： [EMAIL]'),
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'send_recovery_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('发送恢复邮件状态码'),
                    },
                    {
                        opcode: 'was_recovery_sent_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('发送恢复邮件是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'confirm_recovery',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('确认账户恢复 邮箱： [EMAIL] 验证码： [CODE] TOTP： [TOTP] 恢复码： [BACKUP]'),
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            TOTP: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            BACKUP: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            }
                        }
                    },
                    {
                        opcode: 'confirm_recovery_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('确认恢复状态码'),
                    },
                    {
                        opcode: 'was_recovery_confirmed_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('确认恢复是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'change_password',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('更改密码 当前密码： [CURRENT_PASSWORD] 新密码： [NEW_PASSWORD]'),
                        arguments: {
                            CURRENT_PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            NEW_PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'change_password_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('更改密码状态码'),
                    },
                    {
                        opcode: 'was_change_password_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('更改密码是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'change_email',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('更改邮箱 密码： [PASSWORD] 新邮箱： [NEW_EMAIL]'),
                        arguments: {
                            PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            NEW_EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'change_email_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('更改邮箱状态码'),
                    },
                    {
                        opcode: 'was_change_email_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('更改邮箱是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'confirm_email_change',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('确认邮箱更改 令牌： [TOKEN]'),
                        arguments: {
                            TOKEN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'confirm_email_change_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('确认邮箱更改状态码'),
                    },
                    {
                        opcode: 'was_confirm_email_change_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('确认邮箱更改是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'disable_totp',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('禁用 TOTP 恢复码： [BACKUP_CODE]'),
                        arguments: {
                            BACKUP_CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'disable_totp_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('禁用 TOTP 状态码'),
                    },
                    {
                        opcode: 'was_disable_totp_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('禁用 TOTP 是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'regenerate_recovery_codes',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('重新生成恢复码'),
                    },
                    {
                        opcode: 'regenerate_recovery_codes_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('重新生成恢复码状态码'),
                    },
                    {
                        opcode: 'was_regenerate_recovery_codes_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('重新生成恢复码是否成功？'),
                    },
                    {
                        opcode: 'recovery_codes_data',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('恢复码数据 (JSON)'),
                    },
                    "---",
                    {
                        opcode: 'register_developer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('注册开发者工作室 名称： [NAME] 描述： [DESCRIPTION] 成员 (JSON)： [MEMBERS]'),
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            DESCRIPTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            MEMBERS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '[]',
                            },
                        }
                    },
                    {
                        opcode: 'register_developer_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('注册开发者状态码'),
                    },
                    {
                        opcode: 'was_register_developer_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('注册开发者是否成功？'),
                    },
                    {
                        opcode: 'register_developer_id',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('开发者 ID'),
                    },
                    "---",
                    {
                        opcode: 'register_game',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('注册游戏 开发者 ID： [DEVID] 名称： [NAME] 描述： [DESCRIPTION] 特性 (JSON)： [FEATURES]'),
                        arguments: {
                            DEVID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            DESCRIPTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            FEATURES: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '[]',
                            },
                        }
                    },
                    {
                        opcode: 'register_game_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('注册游戏状态码'),
                    },
                    {
                        opcode: 'was_register_game_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('注册游戏是否成功？'),
                    },
                    {
                        opcode: 'register_game_id',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('游戏 ID'),
                    },
                    "---",
                    {
                        opcode: 'trigger_achievement',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('触发成就 游戏 ID： [GAME_ID] 描述： [DESCRIPTION] 点数： [POINTS] 图标 ID： [ICON_ID]'),
                        arguments: {
                            GAME_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            DESCRIPTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            POINTS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0',
                            },
                            ICON_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'achievement_trigger_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('触发成就状态码'),
                    },
                    {
                        opcode: 'was_achievement_trigger_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('触发成就是否成功？'),
                    },
                    {
                        opcode: 'achievement_triggered_data',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('触发成就数据 (JSON)'),
                    },
                    {
                        opcode: 'get_achievements',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('获取成就列表 游戏 ID（可选）： [GAME_ID]'),
                        arguments: {
                            GAME_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'achievements_list',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('成就列表 (JSON)'),
                    },
                    {
                        opcode: 'was_get_achievements_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('获取成就是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'get_profile',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('获取个人资料'),
                    },
                    {
                        opcode: 'get_profile_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('获取个人资料状态码'),
                    },
                    {
                        opcode: 'was_get_profile_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('获取个人资料是否成功？'),
                    },
                    {
                        opcode: 'profile_data',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('个人资料 (JSON)'),
                    },
                    {
                        opcode: 'avatar_url',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('头像 URL'),
                    },
                    "---",
                    {
                        opcode: 'update_profile',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('更新个人资料 姓名： [NAME] 简介： [BIO] 地址： [LOCATION] 网站： [WEBSITE]'),
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            BIO: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            LOCATION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            WEBSITE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'update_profile_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('更新个人资料状态码'),
                    },
                    {
                        opcode: 'was_update_profile_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('更新个人资料是否成功？'),
                    },
                    "---",
                    {
                        opcode: 'upload_avatar',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('上传头像 [FILE]'),
                        arguments: {
                            FILE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },
                    {
                        opcode: 'upload_avatar_status_code',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate('上传头像状态码'),
                    },
                    {
                        opcode: 'was_avatar_upload_successful',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate('上传头像是否成功？'),
                    },
                ],
                menus: {
                    SlotMenu: {
                        acceptReporters: true,
                        items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
                    }
                }
            };
        }

        change_api_url({ URL }) {
            OmegaAuthInstance.rootApiURL = Scratch.Cast.toString(URL);
        }

        change_wss_url({ URL }) {
            OmegaAuthInstance.rootWsURL = Scratch.Cast.toString(URL);
        }

        change_auth_url({ URL }) {
            OmegaAuthInstance.rootAuthURL = Scratch.Cast.toString(URL);
        }

        async login_account({ EMAIL, PASSWORD, TOTP }) {
            await OmegaAuthInstance.Login(Scratch.Cast.toString(EMAIL), Scratch.Cast.toString(PASSWORD), Scratch.Cast.toString(TOTP));
        }

        async guest_login({ USERNAME }) {
            await OmegaAuthInstance.GuestLogin(Scratch.Cast.toString(USERNAME));
        }

        register_status_code() {
            return OmegaAuthInstance.statusCodes.register;
        }

        login_status_code() {
            return OmegaAuthInstance.statusCodes.login;
        }

        save_status_code() {
            return OmegaAuthInstance.statusCodes.save;
        }

        load_status_code() {
            return OmegaAuthInstance.statusCodes.load;
        }

        was_save_successful() {
            return OmegaAuthInstance.saveSuccess;
        }

        async save_slot({ SLOT, DATA }) {
            await OmegaAuthInstance.Save(Scratch.Cast.toNumber(SLOT), Scratch.Cast.toString(DATA));
        }

        was_load_successful() {
            return OmegaAuthInstance.loadSuccess;
        }

        loaded_slot_data() {
            return OmegaAuthInstance.loadedData;
        }

        async load_slot({ SLOT }) {
            await OmegaAuthInstance.Load(SLOT);
        }

        was_login_successful() {
            return OmegaAuthInstance.loginSuccess;
        }

        async register_account({ EMAIL, USERNAME, PASSWORD }) {
            await OmegaAuthInstance.Register(Scratch.Cast.toString(EMAIL), Scratch.Cast.toString(USERNAME), Scratch.Cast.toString(PASSWORD));
            return OmegaAuthInstance.registerSuccess;
        }

        was_register_successful() {
            return OmegaAuthInstance.registerSuccess;
        }

        get_token() {
            return OmegaAuthInstance.sessionToken;
        }

        async verify_account({ CODE }) {
           await OmegaAuthInstance.Verify(Scratch.Cast.toString(CODE));
        }

        resend_status_code() {
            return OmegaAuthInstance.statusCodes.resend;
        }

        was_resend_successful() {
            return OmegaAuthInstance.resendSuccess;
        }

        async resend_verify() {
            await OmegaAuthInstance.ResendVerify();
        }

        verify_status_code() {
            return OmegaAuthInstance.statusCodes.verify;
        }

        was_verify_successful() {
            return OmegaAuthInstance.verifySuccess;
        }

        build_server_url() {
            let url = new URL(OmegaAuthInstance.rootWsURL);
            url.searchParams.append('ugi', OmegaAuthInstance.selectedUgi);
            return url.toString();
        }

        set_ugi({UGI}) {
            OmegaAuthInstance.selectedUgi = Scratch.Cast.toString(UGI);
        }

        async search_users({ QUERY }) {
            await OmegaAuthInstance.SearchUsers(Scratch.Cast.toString(QUERY));
        }

        search_results() {
            return OmegaAuthInstance.searchResults || '[]';
        }

        was_search_successful() {
            return OmegaAuthInstance.searchSuccess;
        }

        async send_friend_request({ USER_ID }) {
            await OmegaAuthInstance.SendFriendRequest(Scratch.Cast.toString(USER_ID));
        }

        async accept_friend_request({ REQUEST_ID }) {
            await OmegaAuthInstance.AcceptFriendRequest(Scratch.Cast.toString(REQUEST_ID));
        }

        async reject_friend_request({ REQUEST_ID }) {
            await OmegaAuthInstance.RejectFriendRequest(Scratch.Cast.toString(REQUEST_ID));
        }

        async cancel_friend_request({ REQUEST_ID }) {
            await OmegaAuthInstance.CancelFriendRequest(Scratch.Cast.toString(REQUEST_ID));
        }

        was_friend_request_successful() {
            return OmegaAuthInstance.friendRequestSuccess;
        }

        was_accept_successful() {
            return OmegaAuthInstance.acceptSuccess;
        }

        was_reject_successful() {
            return OmegaAuthInstance.rejectSuccess;
        }

        was_cancel_successful() {
            return OmegaAuthInstance.cancelSuccess;
        }

        async get_friends() {
            await OmegaAuthInstance.GetFriends();
        }

        friends_list() {
            return OmegaAuthInstance.friendsList || '[]';
        }

        was_get_friends_successful() {
            return OmegaAuthInstance.friendsSuccess;
        }

        async remove_friend({ USER_ID }) {
            await OmegaAuthInstance.RemoveFriend(Scratch.Cast.toString(USER_ID));
        }

        was_remove_friend_successful() {
            return OmegaAuthInstance.removeSuccess;
        }

        async send_message({ USER_ID, CONTENT }) {
            await OmegaAuthInstance.SendMessage(Scratch.Cast.toString(USER_ID), Scratch.Cast.toString(CONTENT));
        }

        async get_messages({ USER_ID }) {
            await OmegaAuthInstance.GetMessages(Scratch.Cast.toString(USER_ID));
        }

        messages_loaded() {
            return OmegaAuthInstance.messagesLoaded || '[]';
        }

        was_send_message_successful() {
            return OmegaAuthInstance.messageSuccess;
        }

        async block_user({ USER_ID }) {
            await OmegaAuthInstance.BlockUser(Scratch.Cast.toString(USER_ID));
        }

        async unblock_user({ USER_ID }) {
            await OmegaAuthInstance.UnblockUser(Scratch.Cast.toString(USER_ID));
        }

        was_block_successful() {
            return OmegaAuthInstance.blockSuccess;
        }

        was_unblock_successful() {
            return OmegaAuthInstance.unblockSuccess;
        }

        async get_blocklist() {
            await OmegaAuthInstance.GetBlocklist();
        }

        blocklist_results() {
            return OmegaAuthInstance.blocklistResults || '[]';
        }

        was_get_blocklist_successful() {
            return OmegaAuthInstance.blocklistSuccess;
        }

        async get_notifications() {
            await OmegaAuthInstance.GetNotifications();
        }

        notifications_loaded() {
            return OmegaAuthInstance.notificationsLoaded || '[]';
        }

        was_get_notifications_successful() {
            return OmegaAuthInstance.notificationsSuccess;
        }

        async mark_notification_read({ NOTIFICATION_ID }) {
            await OmegaAuthInstance.MarkNotificationRead(Scratch.Cast.toString(NOTIFICATION_ID));
        }

        was_mark_notification_read_successful() {
            return OmegaAuthInstance.notificationReadSuccess;
        }

        async logout() {
            await OmegaAuthInstance.Logout();
        }

        logout_status_code() {
            return OmegaAuthInstance.statusCodes.logout;
        }

        was_logout_successful() {
            return OmegaAuthInstance.logoutSuccess;
        }

        async validate_token() {
            await OmegaAuthInstance.Validate();
        }

        validate_status_code() {
            return OmegaAuthInstance.statusCodes.validate;
        }

        was_validate_successful() {
            return OmegaAuthInstance.validateSuccess;
        }

        validated_data() {
            return OmegaAuthInstance.validatedData || 'null';
        }

        async reset_password({ PASSWORD }) {
            await OmegaAuthInstance.ResetPassword(Scratch.Cast.toString(PASSWORD));
        }

        reset_password_status_code() {
            return OmegaAuthInstance.statusCodes.reset_password;
        }

        was_reset_password_successful() {
            return OmegaAuthInstance.resetPasswordSuccess;
        }

        async check_username({ USERNAME }) {
            await OmegaAuthInstance.CheckUsername(Scratch.Cast.toString(USERNAME));
        }

        check_username_status_code() {
            return OmegaAuthInstance.statusCodes.check_username;
        }

        was_username_available() {
            return OmegaAuthInstance.usernameCheckSuccess;
        }

        async begin_totp_enrollment() {
            await OmegaAuthInstance.BeginTotpEnrollment();
        }

        totp_enroll_status_code() {
            return OmegaAuthInstance.statusCodes.totp_enroll;
        }

        was_totp_enroll_successful() {
            return OmegaAuthInstance.totpEnrollSuccess;
        }

        totp_enroll_data() {
            return OmegaAuthInstance.totpEnrollData || 'null';
        }

        async verify_totp_enrollment({ CODE }) {
            await OmegaAuthInstance.VerifyTotpEnrollment(Scratch.Cast.toString(CODE));
        }

        totp_verify_status_code() {
            return OmegaAuthInstance.statusCodes.totp_verify;
        }

        was_totp_verify_successful() {
            return OmegaAuthInstance.totpVerifySuccess;
        }

        totp_verify_data() {
            return OmegaAuthInstance.totpVerifyData || 'null';
        }

        async send_recovery_email({ EMAIL }) {
            await OmegaAuthInstance.SendRecovery(Scratch.Cast.toString(EMAIL));
        }

        send_recovery_status_code() {
            return OmegaAuthInstance.statusCodes.send_recovery;
        }

        was_recovery_sent_successful() {
            return OmegaAuthInstance.recoverySentSuccess;
        }

        async confirm_recovery({ EMAIL, CODE, TOTP, BACKUP }) {
            await OmegaAuthInstance.ConfirmRecovery(Scratch.Cast.toString(EMAIL), Scratch.Cast.toString(CODE), Scratch.Cast.toString(TOTP), Scratch.Cast.toString(BACKUP));
        }

        confirm_recovery_status_code() {
            return OmegaAuthInstance.statusCodes.confirm_recovery;
        }

        was_recovery_confirmed_successful() {
            return OmegaAuthInstance.recoveryConfirmedSuccess;
        }

        async change_password({ CURRENT_PASSWORD, NEW_PASSWORD }) {
            await OmegaAuthInstance.ChangePassword(Scratch.Cast.toString(CURRENT_PASSWORD), Scratch.Cast.toString(NEW_PASSWORD));
        }

        change_password_status_code() {
            return OmegaAuthInstance.statusCodes.change_password;
        }

        was_change_password_successful() {
            return OmegaAuthInstance.changePasswordSuccess;
        }

        async change_email({ PASSWORD, NEW_EMAIL }) {
            await OmegaAuthInstance.ChangeEmail(Scratch.Cast.toString(PASSWORD), Scratch.Cast.toString(NEW_EMAIL));
        }

        change_email_status_code() {
            return OmegaAuthInstance.statusCodes.change_email;
        }

        was_change_email_successful() {
            return OmegaAuthInstance.changeEmailSuccess;
        }

        async confirm_email_change({ TOKEN }) {
            await OmegaAuthInstance.ConfirmEmailChange(Scratch.Cast.toString(TOKEN));
        }

        confirm_email_change_status_code() {
            return OmegaAuthInstance.statusCodes.confirm_email_change;
        }

        was_confirm_email_change_successful() {
            return OmegaAuthInstance.confirmEmailChangeSuccess;
        }

        async disable_totp({ BACKUP_CODE }) {
            await OmegaAuthInstance.DisableTotp(Scratch.Cast.toString(BACKUP_CODE));
        }

        disable_totp_status_code() {
            return OmegaAuthInstance.statusCodes.disable_totp;
        }

        was_disable_totp_successful() {
            return OmegaAuthInstance.disableTotpSuccess;
        }

        async regenerate_recovery_codes() {
            await OmegaAuthInstance.RegenerateRecoveryCodes();
        }

        regenerate_recovery_codes_status_code() {
            return OmegaAuthInstance.statusCodes.regenerate_recovery_codes;
        }

        was_regenerate_recovery_codes_successful() {
            return OmegaAuthInstance.regenerateRecoverySuccess;
        }

        recovery_codes_data() {
            return OmegaAuthInstance.recoveryCodesData || '[]';
        }

        async register_developer({ NAME, DESCRIPTION, MEMBERS }) {
            await OmegaAuthInstance.RegisterDeveloper(Scratch.Cast.toString(NAME), Scratch.Cast.toString(DESCRIPTION), Scratch.Cast.toString(MEMBERS));
        }

        register_developer_status_code() {
            return OmegaAuthInstance.statusCodes.register_developer;
        }

        was_register_developer_successful() {
            return OmegaAuthInstance.registerDeveloperSuccess;
        }

        register_developer_id() {
            return OmegaAuthInstance.registerDeveloperId || 'null';
        }

        async register_game({ DEVID, NAME, DESCRIPTION, FEATURES }) {
            await OmegaAuthInstance.RegisterGame(Scratch.Cast.toString(DEVID), Scratch.Cast.toString(NAME), Scratch.Cast.toString(DESCRIPTION), Scratch.Cast.toString(FEATURES));
        }

        register_game_status_code() {
            return OmegaAuthInstance.statusCodes.register_game;
        }

        was_register_game_successful() {
            return OmegaAuthInstance.registerGameSuccess;
        }

        register_game_id() {
            return OmegaAuthInstance.registerGameId || 'null';
        }

        async trigger_achievement({ GAME_ID, DESCRIPTION, POINTS, ICON_ID }) {
            await OmegaAuthInstance.TriggerAchievement(Scratch.Cast.toString(GAME_ID), Scratch.Cast.toString(DESCRIPTION), Scratch.Cast.toNumber(POINTS), Scratch.Cast.toString(ICON_ID));
        }

        achievement_trigger_status_code() {
            return OmegaAuthInstance.statusCodes.achievement_trigger;
        }

        was_achievement_trigger_successful() {
            return OmegaAuthInstance.achievementTriggerSuccess;
        }

        achievement_triggered_data() {
            return OmegaAuthInstance.achievementTriggeredData || 'null';
        }

        async get_achievements({ GAME_ID }) {
            await OmegaAuthInstance.GetAchievements(Scratch.Cast.toString(GAME_ID));
        }

        get_achievements_status_code() {
            return OmegaAuthInstance.statusCodes.get_achievements;
        }

        was_get_achievements_successful() {
            return OmegaAuthInstance.achievementsLoaded;
        }

        achievements_list() {
            return OmegaAuthInstance.achievementsList || '[]';
        }

        async get_profile() {
            await OmegaAuthInstance.GetProfile();
        }

        get_profile_status_code() {
            return OmegaAuthInstance.statusCodes.get_profile;
        }

        was_get_profile_successful() {
            return OmegaAuthInstance.profileLoaded;
        }

        profile_data() {
            return OmegaAuthInstance.profileData || 'null';
        }

        avatar_url() {
            return OmegaAuthInstance.avatarURL || '';
        }

        async update_profile({ NAME, BIO, LOCATION, WEBSITE }) {
            await OmegaAuthInstance.UpdateProfile(
                Scratch.Cast.toString(NAME),
                Scratch.Cast.toString(BIO),
                Scratch.Cast.toString(LOCATION),
                Scratch.Cast.toString(WEBSITE)
            );
        }

        update_profile_status_code() {
            return OmegaAuthInstance.statusCodes.update_profile;
        }

        was_update_profile_successful() {
            return OmegaAuthInstance.profileUpdated;
        }

        async upload_avatar({ FILE }) {
            const filePath = Scratch.Cast.toString(FILE);
            if (!filePath) {
                console.warn('未提供头像文件路径。');
                OmegaAuthInstance.avatarUploadSuccess = false;
                OmegaAuthInstance.statusCodes.upload_avatar = '400';
                return;
            }

            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error('无法读取文件。');
                }
                const blob = await response.blob();
                const file = new File([blob], 'avatar.png', { type: blob.type });
                await OmegaAuthInstance.UploadAvatar(file);
            } catch (error) {
                console.error('Error reading avatar file:', error);
                OmegaAuthInstance.avatarUploadSuccess = false;
                OmegaAuthInstance.statusCodes.upload_avatar = '400';
            }
        }

        upload_avatar_status_code() {
            return OmegaAuthInstance.statusCodes.upload_avatar;
        }

        was_avatar_upload_successful() {
            return OmegaAuthInstance.avatarUploadSuccess;
        }
    }

    Scratch.extensions.register(new CloudLinkOmega(Scratch));
})(Scratch);
