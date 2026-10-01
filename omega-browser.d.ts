export interface OmegaBrowserOptions {
  apiUrl?: string;
  authUrl?: string;
  authV1Url?: string;
  baseUrl?: string;
  ugi?: string;
  verbose?: boolean;
}

export interface OmegaRequestResult<T = unknown> {
  response: Response;
  data: T;
  text: string;
}

export interface OmegaStatusPayload {
  ok: boolean;
  status: number;
  data?: unknown;
  text?: string;
}

export interface OmegaProfileData {
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

export interface OmegaFriend {
  id: string;
  username: string;
  created_at?: string;
}

export interface OmegaFriendRequest {
  id: string;
  requester_id: string;
  receiver_id: string;
  status?: string;
  created_at?: string;
}

export interface OmegaMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at?: string;
}

export interface OmegaNotification {
  id: string;
  type?: string;
  title?: string;
  message?: string;
  read?: boolean;
  created_at?: string;
  data?: unknown;
}

export interface OmegaAchievement {
  id: string;
  game_id?: string;
  description?: string;
  points?: number;
  icon_id?: string;
  created_at?: string;
}

export interface OmegaDeveloper {
  id: string;
  name: string;
  description?: string;
  members?: string[];
}

export interface OmegaGame {
  id: string;
  developer_id: string;
  name: string;
  description?: string;
  features?: unknown[];
}

export interface OmegaUnreadCount {
  count: number;
}

export class OmegaBrowser extends EventTarget {
  constructor(opts?: OmegaBrowserOptions);

  setUgi(ugi: string): void;
  getSessionToken(): string;

  guestLogin(username: string): Promise<boolean>;
  login(email: string, password: string, totp?: string): Promise<boolean>;
  register(email: string, username: string, password: string): Promise<boolean>;
  verify(code: string): Promise<boolean>;
  resendVerify(): Promise<boolean>;
  validate(): Promise<boolean>;
  logout(): Promise<boolean>;

  resetPassword(password: string): Promise<boolean>;
  checkUsername(username: string): Promise<boolean>;
  beginTotpEnrollment(): Promise<unknown | null>;
  verifyTotpEnrollment(code: string): Promise<unknown | null>;
  sendRecovery(email: string): Promise<boolean>;
  confirmRecovery(email: string, code: string, totp?: string, backupCode?: string): Promise<boolean>;
  changePassword(currentPassword: string, newPassword: string): Promise<boolean>;
  changeEmail(password: string, newEmail: string): Promise<boolean>;
  confirmEmailChange(token: string): Promise<boolean>;
  disableTotp(backupCode: string): Promise<boolean>;
  regenerateRecoveryCodes(): Promise<string[]>;

  save(saveSlot: number, saveData: string): Promise<boolean>;
  load(saveSlot: number): Promise<string | null>;

  searchUsers(query: string): Promise<unknown[]>;
  sendFriendRequest(receiverId: string): Promise<boolean>;
  acceptFriendRequest(requestId: string): Promise<boolean>;
  rejectFriendRequest(requestId: string): Promise<boolean>;
  cancelFriendRequest(requestId: string): Promise<boolean>;
  getFriends(): Promise<OmegaFriend[]>;
  getFriendRequests(): Promise<OmegaFriendRequest[]>;
  removeFriend(friendId: string): Promise<boolean>;
  sendMessage(receiverId: string, content: string): Promise<boolean>;
  getMessages(userId: string): Promise<OmegaMessage[]>;
  blockUser(blockedId: string): Promise<boolean>;
  unblockUser(blockedId: string): Promise<boolean>;
  getBlocklist(): Promise<unknown[]>;

  getNotifications(): Promise<OmegaNotification[]>;
  getUnreadNotificationCount(): Promise<OmegaUnreadCount | null>;
  markNotificationRead(notificationId: string): Promise<boolean>;
  markAllNotificationsRead(): Promise<boolean>;

  getProfile(): Promise<OmegaProfileData | null>;
  updateProfile(name?: string, bio?: string, location?: string, website?: string): Promise<boolean>;
  uploadAvatar(file: File): Promise<unknown | null>;

  triggerAchievement(gameId: string, description: string, points: number, iconId: string): Promise<unknown | null>;
  getAchievements(gameId?: string): Promise<OmegaAchievement[]>;
  registerDeveloper(name: string, description: string, members?: string): Promise<unknown | null>;
  registerGame(developerId: string, name: string, description: string, features?: string): Promise<unknown | null>;

  on<K extends keyof OmegaEventMap>(event: K, listener: (payload: OmegaEventMap[K]) => void): this;
  off<K extends keyof OmegaEventMap>(event: K, listener: (payload: OmegaEventMap[K]) => void): this;
}

export interface OmegaEventMap {
  login: OmegaStatusPayload;
  loginError: OmegaStatusPayload;
  register: OmegaStatusPayload;
  registerError: OmegaStatusPayload;
  verify: OmegaStatusPayload;
  resendVerify: OmegaStatusPayload;
  validate: OmegaStatusPayload & { data: unknown };
  logout: OmegaStatusPayload;
  save: OmegaStatusPayload & { text?: string };
  load: OmegaStatusPayload & { data?: string | null };
  search: OmegaStatusPayload & { data: unknown[] };
  friendRequest: OmegaStatusPayload;
  friendAccept: OmegaStatusPayload;
  friendReject: OmegaStatusPayload;
  friendCancel: OmegaStatusPayload;
  friendRequests: OmegaStatusPayload & { data: OmegaFriendRequest[] };
  friendRemove: OmegaStatusPayload;
  friends: OmegaStatusPayload & { data: OmegaFriend[] };
  messageSend: OmegaStatusPayload;
  messages: OmegaStatusPayload & { data: OmegaMessage[] };
  block: OmegaStatusPayload;
  unblock: OmegaStatusPayload;
  blocklist: OmegaStatusPayload & { data: unknown[] };
  notifications: OmegaStatusPayload & { data: OmegaNotification[] };
  notificationRead: OmegaStatusPayload;
  unreadNotificationCount: OmegaStatusPayload & { data: OmegaUnreadCount | null };
  notificationsAllRead: OmegaStatusPayload;
  profile: OmegaStatusPayload & { data: OmegaProfileData | null };
  profileUpdate: OmegaStatusPayload;
  avatarUpload: OmegaStatusPayload & { data: unknown | null };
  achievementTrigger: OmegaStatusPayload & { data: unknown | null };
  achievements: OmegaStatusPayload & { data: OmegaAchievement[] };
  developerRegister: OmegaStatusPayload & { data: unknown | null };
  gameRegister: OmegaStatusPayload & { data: unknown | null };
  totpEnrollmentBegin: OmegaStatusPayload & { data: unknown | null };
  totpEnrollmentVerify: OmegaStatusPayload & { data: unknown | null };
  recoverySend: OmegaStatusPayload;
  recoveryConfirm: OmegaStatusPayload;
  recoveryCodesRegenerate: OmegaStatusPayload & { codes: string[] };
  resetPassword: OmegaStatusPayload;
  checkUsername: OmegaStatusPayload;
  changePassword: OmegaStatusPayload;
  changeEmail: OmegaStatusPayload;
  confirmEmailChange: OmegaStatusPayload;
  disableTotp: OmegaStatusPayload;
}

declare global {
  interface Window {
    OmegaBrowser: typeof OmegaBrowser;
  }
}

export {};
