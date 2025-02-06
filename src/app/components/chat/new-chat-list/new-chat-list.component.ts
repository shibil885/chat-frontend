import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '../../../model/user/user.model';
import { ChatService } from '../../../shared/services/chat/chat.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-chat-list.component.html',
  styleUrls: ['./new-chat-list.component.css'],
})
export class NewChatListComponent {
  users: IUser[] = [];
  colors: string[] = ['#ff6b54', '#34a853', '#4285f4', '#fbbc05'];

  constructor(private _chatService: ChatService) {}

  ngOnInit(): void {
    this._fetchUsers();
  }

  private _fetchUsers(): void {
    this._chatService.usersToChat().subscribe((res) => {
      this.users = res.data ? res.data : [];
    });
  }

  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  isUser(user: IUser): user is IUser {
    return (user as IUser).username !== undefined;
  }

  onSelectUser(user: IUser) {
    console.log(user);
  }
}
