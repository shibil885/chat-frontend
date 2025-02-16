import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IChat } from '../../../model/chat/chat.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
  @Input() chat!: IChat;
  @Output() selectChatEvent = new EventEmitter();

  get getName() {
    if (this.chat.isGroupChat) {
      return this.chat.name;
    } else {
      return this.chat.participants.filter(
        (user) => user._id !== this.chat.loggeduser
      )[0].username;
    }
  }

  get getAvatar() {
    return this.chat.participants.filter(
      (user) => user._id !== this.chat.loggeduser
    )[0].avatar;
  }

  onSelectChat() {
    if (this.chat.isGroupChat) {
      this.selectChatEvent.emit({ type: 'group', id: this.chat._id });
    } else {
      const receiverId = this.chat.participants.filter(
        (user) => user._id !== this.chat.loggeduser
      )[0]._id;
      this.selectChatEvent.emit({ type: '', id: receiverId });
    }
  }
}
