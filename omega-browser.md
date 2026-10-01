# Cloudlink Omega Browser SDK

A browser-ready wrapper around the Cloudlink Omega API surface. It does not require Scratch or TurboWarp.

## Files

- `omega-browser.js` - browser SDK
- `omega-browser.d.ts` - TypeScript declarations
- `omega-browser-example.html` - example page
- `omega-browser.zh-CN.md` - 中文使用文档
- `README.md` - 英文说明

## Quick start

```html
<script src="omega-browser.js"></script>
<script>
  const omega = new OmegaBrowser({ apiUrl: '/api/v1', authUrl: '/accounts/api/v0' });

  omega.on('login', () => console.log('logged in'));
  omega.on('profile', (info) => console.log('profile', info.data));

  await omega.guestLogin('myuser');
  await omega.getProfile();
</script>
```

## Constructor options

```js
new OmegaBrowser({
  apiUrl: '/api/v1',
  authUrl: '/accounts/api/v0',
  authV1Url: '/accounts/api/v1',
  ugi: '01HNPHRWS0N0AYMM5K4HN31V4W',
  verbose: false
});
```

## Auth / session

```js
await omega.guestLogin('username');
await omega.login('email', 'password', 'totp?');
await omega.register('email', 'username', 'password');
await omega.verify('123456');
await omega.resendVerify();
await omega.validate();
await omega.logout();
omega.setUgi('...');
omega.getSessionToken();
```

> **Auth model**
>
> - The Omega backend authenticates with a **cookie session** (`clomega-authorization`), set by the backend on `guestLogin` / `login` / `register`.
> - Every SDK request uses `credentials: 'include'`, so same-origin deployments send the cookie automatically.
> - The plain-text token returned by the login endpoints is extracted (trimmed + validated) into `sessionToken`; subsequent requests also send an `Authorization: Bearer <sessionToken>` header, and endpoints such as `/save` `/load` include the `token` body field as the backend expects.
> - For cross-origin deployments the backend must allow credentials (`Access-Control-Allow-Origin` cannot be `*`).
> - Expired sessions surface as non-2xx responses / thrown errors; listen to the matching `xxxError` events or catch exceptions.

## Account security

```js
await omega.checkUsername('desired_name');
await omega.resetPassword('new_password');
await omega.changePassword('current_password', 'new_password');
await omega.changeEmail('password', 'new_email');
await omega.confirmEmailChange('token');
await omega.beginTotpEnrollment();
await omega.verifyTotpEnrollment('code');
await omega.disableTotp('backup_code');
await omega.sendRecovery('email@example.com');
await omega.confirmRecovery('email@example.com', 'code', 'totp?', 'backup_code');
const codes = await omega.regenerateRecoveryCodes();
```

## Cloud saves

```js
await omega.save(1, 'save data string');
const data = await omega.load(1);
```

## Friends / messages

```js
await omega.searchUsers('query');
await omega.sendFriendRequest(userId);
await omega.acceptFriendRequest(requestId);
await omega.rejectFriendRequest(requestId);
await omega.cancelFriendRequest(requestId);
await omega.getFriends();
await omega.getFriendRequests();
await omega.removeFriend(userId);
await omega.sendMessage(userId, 'hello');
await omega.getMessages(userId);
await omega.blockUser(userId);
await omega.unblockUser(userId);
await omega.getBlocklist();
```

## Notifications

```js
await omega.getNotifications();
await omega.getUnreadNotificationCount();
await omega.markNotificationRead(notificationId);
await omega.markAllNotificationsRead();
```

## Profile

```js
const profile = await omega.getProfile();
await omega.updateProfile('name', 'bio', 'location', 'website');
await omega.uploadAvatar(fileInput.files[0]);
```

## Achievements / developer / games

```js
await omega.triggerAchievement(gameId, 'desc', 10, 'iconId');
await omega.getAchievements(gameId);
await omega.registerDeveloper('name', 'desc', ['userId1', 'userId2']);
await omega.registerGame(devId, 'name', 'desc', ['feature1', 'feature2']);
```

## Events

- `login`, `loginError`
- `register`, `registerError`
- `verify`
- `resendVerify`
- `validate`
- `logout`
- `save`, `load`
- `search`
- `friendRequest`, `friendAccept`, `friendReject`, `friendCancel`, `friendRequests`, `friendRemove`, `friends`
- `messageSend`, `messages`
- `block`, `unblock`, `blocklist`
- `notifications`, `notificationRead`, `unreadNotificationCount`, `notificationsAllRead`
- `profile`, `profileUpdate`, `avatarUpload`
- `achievementTrigger`, `achievements`
- `developerRegister`, `gameRegister`
- `totpEnrollmentBegin`, `totpEnrollmentVerify`
- `recoverySend`, `recoveryConfirm`, `recoveryCodesRegenerate`
- `resetPassword`
- `checkUsername`
- `changePassword`, `changeEmail`, `confirmEmailChange`, `disableTotp`
