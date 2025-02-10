import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../../model/user/user.model';
import { IApiResponse } from '../../../interfaces/response.interface';
import { IChat } from '../../../model/chat/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // private readonly _BASE_URL = import.meta.env.NG_APP_BASE_URL;
  private readonly _BASE_URL = 'http://localhost:4000';
  private readonly _api = `${this._BASE_URL}/chat`;
  constructor(private _http: HttpClient) {}

  getAllChats() {
    return this._http.get<IApiResponse<IChat[]>>(`${this._api}/getAllChat`, {
      withCredentials: true,
    });
  }

  usersToChat() {
    return this._http.get<IApiResponse<IUser[]>>(`${this._api}/newUsers`, {
      withCredentials: true,
    });
  }

  creatOrGetAOneOnOneChat(receiverId: string) {
    return this._http.post<IApiResponse<IChat>>(
      `${this._api}/getOrCreate/${receiverId}`,
      {},
      { withCredentials: true }
    );
  }

  createNewGroupChat(groupChatData: { users: IUser[]; name: string }) {
    return this._http.post<IApiResponse<IChat>>(
      `${this._api}/creategroupchat`,
      {
        participants: groupChatData.users,
        name: groupChatData.name,
      },
      { withCredentials: true }
    );
  }

  getAGroupChat(chatId: string) {
    return this._http.get<IApiResponse<IChat>>(
      `${this._api}/getgroupchat/${chatId}`,
      {
        withCredentials: true,
      }
    );
  }
}
