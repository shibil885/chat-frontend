import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChat } from '../../../model/chat/chat.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @Input() chats: IChat[] = [];
  @Output() filteredChats = new EventEmitter<IChat[]>();
  @Output() resetEvent = new EventEmitter();

  searchQuery: string = '';

  onSearch() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.resetEvent.emit();
      return;
    }

    const filtered = this.chats.filter((chat) => {
      if (chat.isGroupChat) {
        return chat.name.toLowerCase().includes(query.toLowerCase());
      } else {
        let receiver = chat.participants.find(
          (user) => user._id !== chat.loggeduser
        );
        return receiver?.username.toLowerCase().includes(query.toLowerCase());
      }
    });
    this.filteredChats.emit(filtered);
  }
}
