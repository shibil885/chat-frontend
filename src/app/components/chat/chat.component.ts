import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewChatListComponent } from './new-chat-list/new-chat-list.component';
import { SearchComponent } from './search/search.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { IChat } from '../../model/chat/chat.model';
import { ChatService } from '../../shared/services/chat/chat.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../shared/services/messages/message.service';
import { MessageContainerComponent } from './message-container/message-container.component';
import { IChatMessage } from '../../model/messages/message.model';
import { IUser } from '../../model/user/user.model';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { SocketService } from '../../shared/services/socket/socket.service';
import { ChatEventEnum } from '../../enum/socketEvent.enum';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchComponent,
    ChatListComponent,
    NewChatListComponent,
    MessageContainerComponent,
    FileUploaderComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  showNewChatList: boolean = false;
  selectedChat!: IChat;
  showAttachments = false;
  selectedAttachmentType: string = '';
  selectedFile: File | null = null;
  error: string = '';
  allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
  allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  chats: IChat[] = [];
  messages: IChatMessage[] = [];
  content: string = '';
  constructor(
    private _chatService: ChatService,
    private _messageService: MessageService,
    private _socketService: SocketService,
    private _zone: NgZone
  ) {}

  ngOnInit() {
    this.fetchChats();
    this._socketService
      .listenEvent(ChatEventEnum.MESSAGE_RECEIVED_EVENT)
      .subscribe((res) => {
        this._zone.run(() => {
          this._fetchAllMessages(res.chat);
          this.fetchChats();
        });
      });
  }

  addChat() {
    this.showNewChatList = !this.showNewChatList;
  }

  private fetchChats() {
    this._chatService.getAllChats().subscribe((res) => {
      this.chats = res.data?.length ? res.data : [];
    });
  }

  private _fetchAllMessages(chatId?: string) {
    this._messageService.fetchAllMessages(chatId).subscribe((res) => {
      if (res.data) {
        this.messages = res.data;
      }
    });
  }

  createOrGetAOneOnOneChat(userId: string) {
    if (this.showNewChatList) this.showNewChatList = !this.showNewChatList;
    this._chatService.creatOrGetAOneOnOneChat(userId).subscribe((res) => {
      if (res.data) this.selectedChat = res.data;
      this.fetchChats();
      this._fetchAllMessages(res.data?._id);
    });
  }

  addMessage() {
    this._messageService
      .addMessage(
        this.selectedChat._id,
        this.content,
        this.selectedFile,
        this.selectedAttachmentType
      )
      .subscribe((res) => {
        this.content = '';
        this._fetchAllMessages(this.selectedChat._id);
        this.fetchChats();
      });
  }

  get getName() {
    if (this.selectedChat.isGroupChat) {
      return this.selectedChat.name;
    } else {
      return this.selectedChat.participants.filter(
        (user) => user._id !== this.selectedChat.loggeduser
      )[0].username;
    }
  }

  onCreateNewGroup(groupData: { users: IUser[]; groupName: string }) {
    this.showNewChatList = !this.showNewChatList;
    this._chatService
      .createNewGroupChat({
        users: groupData.users,
        name: groupData.groupName,
      })
      .subscribe((res) => {
        if (res) {
          this.fetchChats();
        }
      });
  }

  onSelectChat(data: { type: string; id: string }) {
    if (data.type !== 'group') {
      this.createOrGetAOneOnOneChat(data.id);
    } else {
      this._chatService.getAGroupChat(data.id).subscribe((res) => {
        if (res.data) this.selectedChat = res.data;
        this._fetchAllMessages(res.data?._id);
      });
    }
  }
  toggleAttachmentMenu() {
    this.showAttachments = !this.showAttachments;
  }

  selectAttachment(type: string) {
    this.selectedAttachmentType = type;
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const fileType = file.type;

      if (
        this.selectedAttachmentType == 'image' &&
        !this.allowedImageTypes.includes(fileType)
      ) {
        this.error = 'Please select a valid image file!';
        this.selectedFile = file;
        this.showAttachments = false;
        return;
      }

      if (
        this.selectedAttachmentType == 'document' &&
        !this.allowedDocTypes.includes(fileType)
      ) {
        this.error = 'Please select a valid document file!';
        this.selectedFile = file;
        this.showAttachments = false;
        return;
      }

      this.selectedFile = file;
      this.showAttachments = false;
      this.error = '';
    }
  }

  isValidFile(file: File): boolean {
    const fileType = file.type;
    return [...this.allowedImageTypes, ...this.allowedDocTypes].includes(
      fileType
    );
  }

  onReTryToSelectFile(type: string) {
    this.error = '';
    this.selectedAttachmentType = type;
    this.fileInput.nativeElement.click();
  }

  onCancelFileUpload() {
    this.selectedFile = null;
  }

  handleFileUpload(file: File) {
    this.selectedFile = file;
    this.addMessage();
  }
}
