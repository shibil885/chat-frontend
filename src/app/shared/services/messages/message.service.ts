import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { IUser } from '../../../model/user/user.model';
import { IApiResponse } from '../../../interfaces/response.interface';
import { IChat } from '../../../model/chat/chat.model';
import { IChatMessage } from '../../../model/messages/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // private readonly _BASE_URL = import.meta.env.NG_APP_BASE_URL;
  private readonly _BASE_URL = 'http://localhost:3000';
  private readonly _api = `${this._BASE_URL}/message`;
  constructor(private _http: HttpClient) {}

  addMessage(chatId: string, content: string) {
    return this._http.post<IApiResponse<IChatMessage>>(
      `${this._api}/addmessage/${chatId}`,
      { content },
      { withCredentials: true }
    );
  }
  fetchAllMessages(chatId?: string) {
    return this._http.get<IApiResponse<IChatMessage[]>>(
      `${this._api}/messages/${chatId}`,
      {
        withCredentials: true,
      }
    );
  }
}
