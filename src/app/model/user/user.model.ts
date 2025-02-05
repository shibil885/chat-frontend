export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  socketId?: string | null;
  isVerified?: boolean;
  friends?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
