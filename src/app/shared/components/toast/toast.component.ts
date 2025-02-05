import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ToastMessage, ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class ToastComponent {
  toastMessages: ToastMessage[] = [];

  constructor(private _toastService: ToastService) {}

  ngOnInit() {
    this._toastService.toastState.subscribe((toast: ToastMessage) => {
      console.log(this.toastMessages);
      
      this.toastMessages.push(toast);
      setTimeout(() => this.removeToast(toast), 3000);
    });
  }

  removeToast(toast: ToastMessage) {
    this.toastMessages = this.toastMessages.filter((t) => t !== toast);
  }
}
