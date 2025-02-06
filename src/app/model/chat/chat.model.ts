export interface Chat {
  _id: string;
  name: string;
  isGroupChat: boolean;
  lastMessage?: string;
  participants: string[];
  admin?: string;
  createdAt: string;
  updatedAt: string;
}
