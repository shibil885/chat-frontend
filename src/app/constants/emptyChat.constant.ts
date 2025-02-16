import { IChat } from '../model/chat/chat.model';

export const EMPTY_CHAT: IChat = {
  _id: '',
  name: '',
  isGroupChat: false,
  lastMessage: [],
  participants: [],
  admin: undefined,
  loggeduser: undefined,
  sender: undefined,
  messages: [],
  unreadMessages: [],
  createdAt: '',
  updatedAt: '',
};
