import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { IUser } from '../../../model/user/user.model';
import { IApiResponse } from '../../../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // private readonly _BASE_URL = import.meta.env.NG_APP_BASE_URL;
  private readonly _BASE_URL = 'http://localhost:3000';
  private readonly _api = `${this._BASE_URL}/chat`;
  constructor(private _http: HttpClient) {}

  getAllChats() {
    // const params = new HttpParams().set('userType', userType);
    // const headers = new HttpHeaders().set('skip-loading', 'true');
    // return this._http.get<{
    //   success: boolean;
    //   message: string;
    //   chats: IChat[];
    // }>(`${this._api}`, {
    //   params,
    //   headers,
    //   withCredentials: true,
    // });
  }

  getAllMessages(chatId: string) {
    // const headers = new HttpHeaders().set('skip-loading', 'true');
    // return this._http.get<{
    //   success: boolean;
    //   message: string;
    //   messages: IMessage[];
    // }>(`${this._api}/messages/${chatId}`, {
    //   headers,
    //   withCredentials: true,
    // });
  }

  usersToChat() {
    // const headers = new HttpHeaders().set('skip-loading', 'true');
    return this._http.get<IApiResponse<IUser[]>>(`${this._api}/newUsers`, {
      withCredentials: true,
    });
  }

  initializeChat(id: string) {
    // const headers = new HttpHeaders().set('skip-loading', 'true');
    // return this._http
    //   .post<{ success: boolean; message: string; chat: IChat }>(
    //     `${this._api}/initialize`,
    //     { id, userType },
    //     { headers, withCredentials: true }
    //   )
    //   .pipe(
    //     tap((res) => {
    //       console.log('log from tap initialize', res);
    //     })
    //   );
  }

  addMessage(chatId: string, content: string) {
    const headers = new HttpHeaders().set('skip-loading', 'true');
    return this._http.post<{ success: boolean; message: string }>(
      `${this._api}/addMessage/${chatId}`,
      { content },
      { headers, withCredentials: true }
    );
  }

  makeAllMessageAsRead(chatId: string, userType: string) {
    const headers = new HttpHeaders().set('skip-loading', 'true');
    return this._http.patch<{ success: boolean; message: string }>(
      `${this._api}/makeMessageRead`,
      { chatId, userType },
      { headers, withCredentials: true }
    );
  }
}
