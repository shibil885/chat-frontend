import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IChatMessage } from '../../../model/messages/message.model';

@Component({
  selector: 'app-message-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-container.component.html',
  styleUrl: './message-container.component.css',
})
export class MessageContainerComponent {
  @Input() messages!: IChatMessage[];
  @Input() isGroupChat!: boolean;
  @Output() allMessageReadEvent = new EventEmitter();

  ngOnInit(): void {
    this.allMessageReadEvent.emit();
  }
}
