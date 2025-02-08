import { IChatMessage } from '../messages/message.model';
import { IUser } from '../user/user.model';

export interface IChat {
  _id: string;
  name: string;
  isGroupChat: boolean;
  lastMessage?: IChatMessage[];
  participants: IUser[];
  admin?: string;
  loggedinuser?: string;
  messages: IChatMessage[];
  createdAt: string;
  updatedAt: string;
}
