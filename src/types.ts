// Bot Interfaces
export interface IResponseTrigger {
  triggerPatterns: RegExp[];
  accessToken?: string;
  allowedGroups: string[];

  isTrigger(messageText: string): boolean;
  respond(message: IGroupMeMessage): Promise<IBotResponse>;
}

export interface IBotResponse {
  responseText: string;
  attachments?: any[];
  picture_url?: string;
}

export interface IMessageRequest {
  text: string;
  attachments?: any[];
  bot_id: string;
  picture_url?: string;
}

// GroupMe Interfaces
export enum SenderType {
  Bot = "bot",
  User = "user",
}

export interface IGroupMeMessage {
  attachments?: any[];
  avatar_url: string;
  created_at: Date;
  group_id: string;
  id: string;
  name: string;
  sender_id: string;
  sender_type: SenderType;
  source_guid: string;
  text: string;
  user_id: string;
}

enum GroupType {
  Private = "private",
  Public = "public",
}

export interface IGroupMember {
  user_id: string;
  nickname: string;
  muted: boolean;
  image_url?: string;
}

export interface IGroup {
  id: string;
  name: string;
  type: GroupType;
  description: string;
  image_url?: string;
  creator_user_id: string;
  created_at: Date;
  updated_at: string;
  members: IGroupMember[];
  share_url: string;
  messages: IGroupMeMessage[];
}
