# Cloudlink Omega 浏览器版 SDK 中文文档

> 对应文件：`omega/omega-browser.js`  
> 适用场景：普通 HTML 页面，无需 Scratch / TurboWarp。

---

## 1. 快速开始

### 1.1 安装方式

```html
<script src="omega/omega-browser.js"></script>
```

> 如果使用 TypeScript / 构建工具，也可同时引入类型声明：  
> `omega/omega-browser.d.ts`

### 1.2 最小示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Omega Browser SDK Demo</title>
</head>
<body>
  <script src="omega/omega-browser.js"></script>
  <script>
    const omega = new OmegaBrowser({
      apiUrl: '/api/v1',
      authUrl: '/accounts/api/v0'
    });

    omega.on('login', () => console.log('已登录'));
    omega.on('profile', (info) => console.log('资料', info.data));

    await omega.guestLogin('myuser');
    await omega.getProfile();
  </script>
</body>
</html>
```

---

## 2. 初始化配置

```ts
new OmegaBrowser({
  apiUrl: '/api/v1',
  authUrl: '/accounts/api/v0',
  authV1Url: '/accounts/api/v1',
  baseUrl: window.location.origin,
  ugi: '01HNPHRWS0N0AYMM5K4HN31V4W',
  verbose: false
});
```

| 参数 | 说明 |
| --- | --- |
| `apiUrl` | 业务 API 基础地址 |
| `authUrl` | 旧版认证地址，默认 `/accounts/api/v0` |
| `authV1Url` | 新版认证地址，默认 `/accounts/api/v1` |
| `baseUrl` | 站点根地址，用于拼接默认 API |
| `ugi` | 唯一游戏 ID |
| `verbose` | 是否开启控制台调试日志 |

常用实例方法：

- `setUgi(ugi)`：修改当前 UGI
- `getSessionToken()`：获取当前会话令牌

---

## 3. 事件系统

`OmegaBrowser` 基于事件回调返回结果，建议使用 `on` 监听。

常用事件：

| 事件名 | 触发时机 | 关键字段 |
| --- | --- | --- |
| `login` | 登录成功 | `status` |
| `loginError` | 登录失败 | `status`, `data` |
| `register` | 注册成功 | `status` |
| `registerError` | 注册失败 | `status`, `data` |
| `verify` | 邮箱验证成功 | `ok`, `status` |
| `resendVerify` | 重发验证码成功 | `ok`, `status` |
| `validate` | 令牌验证成功 | `ok`, `status`, `data` |
| `logout` | 登出成功 | `ok`, `status` |
| `save` | 保存成功 | `ok`, `status`, `text` |
| `load` | 读取成功 | `ok`, `status`, `data` |
| `search` | 搜索用户成功 | `ok`, `status`, `data` |
| `friendRequest` | 发送好友请求成功 | `ok`, `status` |
| `friendAccept` | 接受好友请求成功 | `ok`, `status` |
| `friendReject` | 拒绝好友请求成功 | `ok`, `status` |
| `friendCancel` | 取消好友请求成功 | `ok`, `status` |
| `friendRequests` | 获取好友请求成功 | `ok`, `status`, `data` |
| `friendRemove` | 删除好友成功 | `ok`, `status` |
| `friends` | 获取好友列表成功 | `ok`, `status`, `data` |
| `messageSend` | 发送消息成功 | `ok`, `status` |
| `messages` | 获取聊天记录成功 | `ok`, `status`, `data` |
| `block` | 拉黑成功 | `ok`, `status` |
| `unblock` | 取消拉黑成功 | `ok`, `status` |
| `blocklist` | 获取黑名单成功 | `ok`, `status`, `data` |
| `notifications` | 获取通知成功 | `ok`, `status`, `data` |
| `notificationRead` | 标记通知已读成功 | `ok`, `status` |
| `unreadNotificationCount` | 获取未读通知数成功 | `ok`, `status`, `data` |
| `notificationsAllRead` | 全部标记已读成功 | `ok`, `status` |
| `profile` | 获取个人资料成功 | `ok`, `status`, `data` |
| `profileUpdate` | 更新资料成功 | `ok`, `status` |
| `avatarUpload` | 上传头像成功 | `ok`, `status`, `data` |
| `achievementTrigger` | 触发成就成功 | `ok`, `status`, `data` |
| `achievements` | 获取成就列表成功 | `ok`, `status`, `data` |
| `developerRegister` | 注册开发者成功 | `ok`, `status`, `data` |
| `gameRegister` | 注册游戏成功 | `ok`, `status`, `data` |
| `totpEnrollmentBegin` | 开始 TOTP 注册成功 | `ok`, `status`, `data` |
| `totpEnrollmentVerify` | 验证 TOTP 注册码成功 | `ok`, `status`, `data` |
| `recoverySend` | 发送恢复邮件成功 | `ok`, `status` |
| `recoveryConfirm` | 确认恢复成功 | `ok`, `status` |
| `recoveryCodesRegenerate` | 重新生成恢复码成功 | `ok`, `status`, `codes` |
| `resetPassword` | 重置密码成功 | `ok`, `status` |
| `checkUsername` | 检查用户名成功 | `ok`, `status` |
| `changePassword` | 更改密码成功 | `ok`, `status` |
| `changeEmail` | 更改邮箱成功 | `ok`, `status` |
| `confirmEmailChange` | 确认邮箱更改成功 | `ok`, `status` |
| `disableTotp` | 禁用 TOTP 成功 | `ok`, `status` |

---

## 4. API 详情

### 4.1 认证与会话

```ts
// 访客登录
const guestOk = await omega.guestLogin('用户名');

// 账号登录
const loginOk = await omega.login('邮箱', '密码', 'TOTP?');

// 注册
const registerOk = await omega.register('邮箱', '用户名', '密码');

// 邮箱验证
const verifyOk = await omega.verify('验证码');
const resendOk = await omega.resendVerify();

// 令牌验证
const validateOk = await omega.validate();

// 登出
const logoutOk = await omega.logout();

// 读取令牌 / UGI
const token = omega.getSessionToken();
omega.setUgi('新UGI');
```

> **认证模型说明**
>
> - Omega 后端以 **Cookie 会话**（`clomega-authorization`）作为主认证方式，`guestLogin` / `login` / `register` 成功后由后端 `Set-Cookie` 写入。
> - SDK 所有请求都带 `credentials: 'include'`，同源部署时浏览器会自动带上该 Cookie，无需手动处理。
> - 登录接口返回的纯文本令牌会被 SDK 提取（自动 `trim` 并做格式校验）存为 `sessionToken`，后续请求会同时附带 `Authorization: Bearer <sessionToken>` 头；`/save`、`/load` 等接口还会按后端约定在 body 里带 `token` 字段。
> - 跨域部署时，后端必须放行 `Access-Control-Allow-Credentials`，且前端 `apiUrl` 需与后端保持一致（`Access-Control-Allow-Origin` 不能为 `*`）。
> - 如果令牌已失效（例如后端会话过期），需要登录的接口会以非 2xx 状态结束并抛出错误，可监听对应的 `xxxError` 事件或捕获异常。

### 4.2 账户安全

```ts
// 用户名检查
const usernameOk = await omega.checkUsername('想要的用户名');

// 密码相关
const resetOk = await omega.resetPassword('新密码');
const changeOk = await omega.changePassword('当前密码', '新密码');

// 邮箱相关
const emailOk = await omega.changeEmail('密码', '新邮箱');
const confirmOk = await omega.confirmEmailChange('令牌');

// TOTP
const totpData = await omega.beginTotpEnrollment();
const verifyData = await omega.verifyTotpEnrollment('验证码');
const disableOk = await omega.disableTotp('恢复码');

// 账户恢复
const sendOk = await omega.sendRecovery('email@example.com');
const confirmOk = await omega.confirmRecovery('email@example.com', '验证码', 'totp?', '恢复码');
const codes = await omega.regenerateRecoveryCodes();
```

### 4.3 云存档

```ts
const saveOk = await omega.save(1, '存档内容');
const saveData = await omega.load(1);
```

### 4.4 好友与消息

```ts
// 搜索用户
const users = await omega.searchUsers('关键词');

// 好友请求
const sendOk = await omega.sendFriendRequest('用户ID');
const acceptOk = await omega.acceptFriendRequest('请求ID');
const rejectOk = await omega.rejectFriendRequest('请求ID');
const cancelOk = await omega.cancelFriendRequest('请求ID');
const requests = await omega.getFriendRequests();

// 好友列表
const friends = await omega.getFriends();
const removeOk = await omega.removeFriend('用户ID');

// 消息
const sendOk = await omega.sendMessage('用户ID', '内容');
const messages = await omega.getMessages('用户ID');

// 黑名单
const blockOk = await omega.blockUser('用户ID');
const unblockOk = await omega.unblockUser('用户ID');
const blocklist = await omega.getBlocklist();
```

### 4.5 通知

```ts
const notifications = await omega.getNotifications();
const unread = await omega.getUnreadNotificationCount();
const readOk = await omega.markNotificationRead('通知ID');
const allReadOk = await omega.markAllNotificationsRead();
```

### 4.6 个人资料

```ts
const profile = await omega.getProfile();

await omega.updateProfile('姓名', '简介', '地址', '网站');
await omega.uploadAvatar(fileInput.files[0]);
```

### 4.7 成就与开发者

```ts
// 成就
const triggerOk = await omega.triggerAchievement('游戏ID', '描述', 10, '图标ID');
const achievements = await omega.getAchievements('游戏ID');

// 开发者 / 游戏
const devOk = await omega.registerDeveloper('名称', '描述', ['用户ID1', '用户ID2']);
const gameOk = await omega.registerGame('开发者ID', '游戏名称', '描述', ['特性1', '特性2']);
```

---

## 5. 数据格式

### 5.1 个人资料

```ts
interface OmegaProfileData {
  username?: string;
  email?: string;
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: {
    link?: string;
  };
}
```

### 5.2 好友

```ts
interface OmegaFriend {
  id: string;
  username: string;
  created_at?: string;
}
```

### 5.3 好友请求

```ts
interface OmegaFriendRequest {
  id: string;
  requester_id: string;
  receiver_id: string;
  status?: string;
  created_at?: string;
}
```

### 5.4 消息

```ts
interface OmegaMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at?: string;
}
```

### 5.5 通知

```ts
interface OmegaNotification {
  id: string;
  type?: string;
  title?: string;
  message?: string;
  read?: boolean;
  created_at?: string;
  data?: unknown;
}
```

### 5.6 成就

```ts
interface OmegaAchievement {
  id: string;
  game_id?: string;
  description?: string;
  points?: number;
  icon_id?: string;
  created_at?: string;
}
```

### 5.7 开发者与游戏

```ts
interface OmegaDeveloper {
  id: string;
  name: string;
  description?: string;
  members?: string[];
}

interface OmegaGame {
  id: string;
  developer_id: string;
  name: string;
  description?: string;
  features?: unknown[];
}
```

---

## 6. 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Omega Browser SDK 示例</title>
</head>
<body>
  <script src="omega/omega-browser.js"></script>
  <script>
    const omega = new OmegaBrowser({ verbose: true });

    omega.on('login', (info) => console.log('登录', info));
    omega.on('profile', (info) => console.log('资料', info.data));
    omega.on('friends', (info) => console.log('好友', info.data));
    omega.on('notifications', (info) => console.log('通知', info.data));

    async function run() {
      await omega.guestLogin('myuser');
      await omega.getProfile();
      await omega.getFriends();
      await omega.getNotifications();
    }

    run();
  </script>
</body>
</html>
```

---

## 7. 与 Scratch 版对照

| Scratch 版 | 浏览器版 |
| --- | --- |
| 访客登录 | `guestLogin` |
| 账号登录 | `login` |
| 注册 | `register` |
| 邮箱验证 | `verify` / `resendVerify` |
| 令牌验证 | `validate` |
| 登出 | `logout` |
| 重置密码 | `resetPassword` |
| 检查用户名 | `checkUsername` |
| TOTP 注册/验证/禁用 | `beginTotpEnrollment` / `verifyTotpEnrollment` / `disableTotp` |
| 账户恢复 | `sendRecovery` / `confirmRecovery` / `regenerateRecoveryCodes` |
| 修改密码/邮箱 | `changePassword` / `changeEmail` / `confirmEmailChange` |
| 保存/读取 | `save` / `load` |
| 好友请求/接受/拒绝/取消 | `sendFriendRequest` / `acceptFriendRequest` / `rejectFriendRequest` / `cancelFriendRequest` |
| 获取好友请求 | `getFriendRequests` |
| 好友列表/删除好友 | `getFriends` / `removeFriend` |
| 搜索用户 | `searchUsers` |
| 发送消息/聊天记录 | `sendMessage` / `getMessages` |
| 拉黑/取消拉黑/黑名单 | `blockUser` / `unblockUser` / `getBlocklist` |
| 通知/已读/未读数 | `getNotifications` / `markNotificationRead` / `getUnreadNotificationCount` / `markAllNotificationsRead` |
| 获取资料/更新资料/头像 | `getProfile` / `updateProfile` / `uploadAvatar` |
| 触发成就/获取成就 | `triggerAchievement` / `getAchievements` |
| 注册开发者/游戏 | `registerDeveloper` / `registerGame` |

---

## 8. 注意事项

- 所有需要登录的接口，如果未登录会直接抛出 `Not logged in`。
- `registerDeveloper` / `registerGame` 的 `members` / `features` 参数接受数组（如 `['id1', 'id2']`），也兼容传 JSON 字符串（如 `'["id1"]'`）。
- `uploadAvatar` 需要传入 `File` 对象，例如 `<input type="file">` 的 `files[0]`。
- 建议配合 HTTPS 使用，避免部分浏览器对 WebRTC / 麦克风 / 摄像头有额外限制。

---

## 9. 相关文件

- `omega/omega-browser.js`：浏览器版 SDK 实现
- `omega/omega-browser.d.ts`：TypeScript 类型声明
- `omega/omega-browser-example.html`：浏览器示例页面
- `omega/README.md`：英文说明文档
