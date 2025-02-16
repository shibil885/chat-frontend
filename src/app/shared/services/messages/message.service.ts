import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse } from '../../../interfaces/response.interface';
import { IChatMessage } from '../../../model/messages/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly _BASE_URL = import.meta.env.NG_APP_BASE_URL;
  private readonly _api = `${this._BASE_URL}/message`;
  constructor(private _http: HttpClient) {}

  addMessage(
    chatId: string,
    content: string,
    attachments: File | null = null,
    fileType: string = ''
  ) {
    const formData = new FormData();
    formData.append('content', content);

    if (attachments) {
      formData.append('attachment', attachments);
      formData.append('fileType', fileType);
    }

    return this._http.post<IApiResponse<IChatMessage>>(
      `${this._api}/addmessage/${chatId}`,
      formData,
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
  
  readAllMessages(chatId: string) {
    return this._http.patch(
      `${this._api}/readallmessages/${chatId}`,
      {},
      { withCredentials: true }
    );
  }
}
