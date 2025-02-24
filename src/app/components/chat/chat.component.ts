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
import { EMPTY_CHAT } from '../../constants/emptyChat.constant';
import { Subscription } from 'rxjs';

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
  typingTimeout: any;
  isTyping = false;
  isRecieverTyping: boolean = false;
  nonParticipants: IUser[] = [];
  selectedParticipants: string[] = [];
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
  isMenuOpen = false;
  isChatOpen: boolean = false;

  private subscriptions: Subscription = new Subscription();
  constructor(
    private _chatService: ChatService,
    private _messageService: MessageService,
    private _socketService: SocketService,
    private _zone: NgZone
  ) {}

  ngOnInit() {
    this.fetchChats();
    this.subscriptions.add(
      this._socketService
        .listenEvent(ChatEventEnum.MESSAGE_RECEIVED_EVENT)
        .subscribe((res) => {
          this._zone.run(() => {
            if (this.selectedChat) {
              this.onReadAllMessages();
            }
            this._fetchAllMessages(res.chat);
            this.fetchChats();
          });
        })
    );

    this.subscriptions.add(
      this._socketService
        .listenEvent(ChatEventEnum.READ_ALL_MESSAGES)
        .subscribe((res) => {
          this._zone.run(() => {
            this._fetchAllMessages(res.chat);
            this.fetchChats();
          });
        })
    );

    this.subscriptions.add(
      this._socketService
        .listenEvent(ChatEventEnum.NEW_GROUP_CREATED)
        .subscribe((res) => {
          this._zone.run(() => {
            this.fetchChats();
          });
        })
    );

    this.subscriptions.add(
      this._socketService
        .listenEvent(ChatEventEnum.TYPING_EVENT)
        .subscribe((data) => {
          this._zone.run(() => {
            this.isRecieverTyping = !this.isRecieverTyping;
          });
        })
    );

    this.subscriptions.add(
      this._socketService
        .listenEvent(ChatEventEnum.STOP_TYPING_EVENT)
        .subscribe((data) => {
          this._zone.run(() => {
            this.isRecieverTyping = !this.isRecieverTyping;
          });
        })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  onChatCloseInSmallDevice() {
    this.isChatOpen = false;
    this.selectedChat = { ...EMPTY_CHAT };
  }

  addChat() {
    this.showNewChatList = !this.showNewChatList;
  }

  fetchChats() {
    this.subscriptions.add(
      this._chatService.getAllChats().subscribe((res) => {
        this.chats = res.data?.length ? res.data : [];
        this.chats.forEach((chat) => {
          this._socketService.emitEvent(
            ChatEventEnum.JOIN_CHAT_EVENT,
            chat._id
          );
        });
      })
    );
  }

  private _fetchAllMessages(chatId?: string) {
    this.subscriptions.add(
      this._messageService
        .fetchAllMessages(chatId ? chatId : this.selectedChat._id)
        .subscribe((res) => {
          if (res.data) {
            this.messages = res.data;
          }
        })
    );
  }

  createOrGetAOneOnOneChat(userId: string) {
    if (this.showNewChatList) this.showNewChatList = !this.showNewChatList;
    this.subscriptions.add(
      this._chatService.creatOrGetAOneOnOneChat(userId).subscribe((res) => {
        if (res.data) this.selectedChat = res.data;
        this.fetchChats();
        this._fetchAllMessages(res.data?._id);
      })
    );
  }

  addMessage() {
    this.subscriptions.add(
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
        })
    );
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

  get getAvatar() {
    return this.selectedChat.participants.filter(
      (user) => user._id !== this.selectedChat.loggeduser
    )[0].avatar;
  }

  get isSelectedChatValid(): boolean {
    return !!(this.selectedChat && this.selectedChat._id);
  }

  onCreateNewGroup(groupData: { users: IUser[]; groupName: string }) {
    this.showNewChatList = !this.showNewChatList;

    this.subscriptions.add(
      this._chatService
        .createNewGroupChat({
          users: groupData.users,
          name: groupData.groupName,
        })
        .subscribe((res) => {
          if (res) {
            this.fetchChats();
          }
        })
    );
  }

  onSelectChat(data: { type: string; id: string }) {
    this.isChatOpen = true;
    if (data.type !== 'group') {
      this.createOrGetAOneOnOneChat(data.id);
    } else {
      this.subscriptions.add(
        this._chatService.getAGroupChat(data.id).subscribe((res) => {
          if (res.data) this.selectedChat = res.data;
          this._fetchAllMessages(res.data?._id);
        })
      );
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

  onTyping() {
    if (!this.isTyping) {
      this.isTyping = true;
      this._socketService.emitEvent(
        ChatEventEnum.TYPING_EVENT,
        this.selectedChat._id
      );
    }

    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
      this._socketService.emitEvent(
        ChatEventEnum.STOP_TYPING_EVENT,
        this.selectedChat._id
      );
    }, 2000);
  }

  onReadAllMessages() {
    this.subscriptions.add(
      this._messageService
        .readAllMessages(this.selectedChat._id)
        .subscribe(() => {
          this.fetchChats();
          this._fetchAllMessages(this.selectedChat._id);
        })
    );
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  addUserToChat() {
    this.subscriptions.add(
      this._chatService
        .getNonParticipants(this.selectedChat._id)
        .subscribe((res) => {
          if (res.data) this.nonParticipants = res.data;
          this.isMenuOpen = false;
        })
    );
  }

  addUser(user: string) {
    this.selectedParticipants.push(user);
  }

  leaveChat() {
    if (this.selectedChat.loggeduser)
      this.subscriptions.add(
        this._chatService
          .leaveChat(this.selectedChat._id, this.selectedChat.loggeduser)
          .subscribe((res) => {
            if (res.data)
              this.fetchChats(), (this.selectedChat = { ...EMPTY_CHAT });
          })
      );
    this.isMenuOpen = false;
  }

  confirmAddUsers() {
    this.subscriptions.add(
      this._chatService
        .addUsersToChat(this.selectedChat._id, this.selectedParticipants)
        .subscribe((res) => {
          if (res.data) this.isMenuOpen = false;
          this.selectedParticipants = [];
          this.nonParticipants = [];
          this.isMenuOpen = false;
        })
    );
  }

  cancelAddUsers() {
    this.selectedParticipants = [];
    this.nonParticipants = [];
    this.isMenuOpen = false;
  }
}
