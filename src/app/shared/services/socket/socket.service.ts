import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private _socket: Socket) {
    this._socket.on('connected', () => {
      console.log('Connected to Socket.IO server');
    });

    this._socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    this._socket.on('error', (error: any) => {
      console.error('Socket.IO error:', error);
    });
  }

  emitEvent(event: string, payload: any): void {
    this._socket.emit(event, payload);
  }

  listenEvent(event: string): Observable<any> {
    return this._socket.fromEvent(event);
  }
}
