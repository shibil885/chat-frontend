import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewChecked,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  private isUserScrollingUp: boolean = false;

  ngOnInit(): void {
    this.allMessageReadEvent.emit();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    if (!this.isUserScrollingUp) {
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const atBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;

    this.isUserScrollingUp = !atBottom;
  }
}
