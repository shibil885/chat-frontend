import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewChatListComponent } from './new-chat-list/new-chat-list.component';
import { IUser } from '../../model/user/user.model';
import { MatDialog } from '@angular/material/dialog';
import { SearchComponent } from './search/search.component';
import { ChatListComponent } from './chat-list/chat-list.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, SearchComponent, ChatListComponent, NewChatListComponent],
  templateUrl: './chat.component.html',
})
export class ChatComponent {
  showNewChatList: boolean = false;
  constructor(private _dialog: MatDialog) {}

  ngOnInit() {
    // TODO
  }

  addChat() {
    this.showNewChatList = !this.showNewChatList
  }
}
