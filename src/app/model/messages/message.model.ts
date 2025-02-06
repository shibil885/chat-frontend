export interface ChatMessage {
  _id: string;
  sender: string;
  content: string;
  attachments: Attachment[];
  chat: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  url: string;
  localPath: string;
}
