// Bot Interfaces
export interface IResponseTrigger {
  triggerWords: string[];
  accessToken?: string;

  respond(message: GroupMeMessage): Promise<BotResponse>
}

export interface BotResponse {
  responseText: string
  attachments?: any[]
}

export interface MessageRequest {
  text: string;
  attachments?: any[];
  bot_id: string;
}

// GroupMe Interfaces
export enum SenderType {
  Bot = "bot",
  User = "user"
}

export interface GroupMeMessage {
  attachments?: any[],
  avatar_url: string,
  created_at: Date,
  group_id: string,
  id: string,
  name: string,
  sender_id: string,
  sender_type: SenderType,
  source_guid: string,
  text: string,
  user_id: string
}

enum GroupType {
  Private = 'private',
  Public = 'public'
}

export interface GroupMember {
  user_id: string,
  nickname: string,
  muted: boolean,
  image_url?: string
}

export interface Group {
  id: string,
  name: string,
  type: GroupType,
  description: string,
  image_url?: string,
  creator_user_id: string,
  created_at: Date,
  updated_at: string,
  members: GroupMember[],
  share_url: string,
  messages: GroupMeMessage[]
}




