import { Component } from '@angular/core';
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
  ],
  templateUrl: './chat.component.html',
})
export class ChatComponent {
  showNewChatList: boolean = false;
  selectedChat!: IChat;
  chats: IChat[] = [];
  messages: IChatMessage[] = [];
  content: string = '';
  constructor(
    private _chatService: ChatService,
    private _messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchChats();
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
        console.log('res', res);
        this.messages = res.data;
      }
    });
  }

  createOrGetAOneOnOneChat(userId: string) {
    if (this.showNewChatList) this.showNewChatList = !this.showNewChatList;
    this._chatService.creatOrGetAOneOnOneChat(userId).subscribe((res) => {
      if (res.data) this.selectedChat = res.data;
      this._fetchAllMessages(res.data?._id)
      this.fetchChats();
    });
  }

  addMessage() {
    this._messageService
      .addMessage(this.selectedChat._id, this.content)
      .subscribe((res) => {
        this.content = '';
        this._fetchAllMessages(this.selectedChat._id)
        this.fetchChats();
      });
  }

  get getName() {
    return this.selectedChat.participants.filter(
      (particopant) => particopant._id !== this.selectedChat.loggedinuser
    )[0].username;
  }
}
