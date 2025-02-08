import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IChatMessage } from '../../../model/messages/message.model';

@Component({
  selector: 'app-message-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-container.component.html',
  styleUrl: './message-container.component.css'
})
export class MessageContainerComponent {
  @Input() messages!: IChatMessage[]
}
