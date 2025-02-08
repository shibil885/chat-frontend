export interface IChatMessage {
  _id: string;
  sender: string;
  content: string;
  attachments: Attachment[];
  chat: string;
  loggeduser?: string
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  url: string;
  localPath: string;
}
