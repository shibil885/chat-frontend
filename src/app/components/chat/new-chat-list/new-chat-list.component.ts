import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '../../../model/user/user.model';
import { ChatService } from '../../../shared/services/chat/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-chat-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-chat-list.component.html',
  styleUrls: ['./new-chat-list.component.css'],
})
export class NewChatListComponent {
  isGroupChatAdd: boolean = false;
  lastStepToCreate: boolean = false;
  name: string = '';
  users: IUser[] = [];
  groupMembers: IUser[] = [];
  colors: string[] = ['#ff6b54', '#34a853', '#4285f4', '#fbbc05'];

  @Output() addNewChatEvent = new EventEmitter();
  @Output() createNewGroupEvent = new EventEmitter();

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

  onAddGroup() {
    this.isGroupChatAdd = !this.isGroupChatAdd;
  }

  onSelectUser(user: IUser) {
    this.addNewChatEvent.emit(user._id);
  }

  onAddMemberToGroup(newUser: IUser) {
    this.groupMembers.push(newUser);
    this.users = this.users.filter((user) => user._id !== newUser._id);
  }

  onRemoveMemberFromGroup(removedUser: IUser) {
    this.users.push(removedUser);
    this.groupMembers = this.groupMembers.filter(
      (user) => removedUser._id !== user._id
    );
  }

  onCancelCreatGroup() {
    this.users = [...this.users, ...this.groupMembers];
    if (!this.users.length) {
      this._fetchUsers();
    }
    this.groupMembers = [];
    this.isGroupChatAdd = !this.isGroupChatAdd;
  }

  toLastStep() {
    this.lastStepToCreate = !this.lastStepToCreate;
    this.users = [];
  }

  onCreateNewGroup() {
    this.createNewGroupEvent.emit({
      users: this.groupMembers,
      groupName: this.name.trim(),
    });
  }
}
