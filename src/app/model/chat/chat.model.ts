import { IChatMessage } from '../messages/message.model';
import { IUser } from '../user/user.model';

export interface IChat {
  _id: string;
  name: string;
  isGroupChat: boolean;
  lastMessage: IChatMessage[];
  participants: IUser[];
  admin?: string;
  loggeduser?: string;
  sender?: string;
  messages: IChatMessage[];
  unreadMessages?: string[];
  createdAt: string;
  updatedAt: string;
}
