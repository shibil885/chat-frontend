import { IUser } from '../user/user.model';

export interface IChatMessage {
  _id: string;
  sender: IUser;
  content: string;
  attachments: Attachment;
  chat: string;
  isRead: boolean
  loggeduser?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  fileName: string;
  url: string;
  fileType: string;
}
