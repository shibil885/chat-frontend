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
  ngAfterViewInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('messages', this.messages);
    
  }
}
