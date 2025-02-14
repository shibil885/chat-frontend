import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _baseUrl = import.meta.env.NG_APP_BASE_URL;
  constructor(private _http: HttpClient) {}

  userLogin<T>(userData: {
    email: string;
    password: string;
  }): Observable<IApiResponse<T>> {
    return this._http.post<IApiResponse<T>>(
      `${this._baseUrl}/auth/login`,
      userData,
      { withCredentials: true }
    );
  }

  userSignup<T>(userData: {
    username: string;
    email: string;
    password: string;
  }): Observable<IApiResponse<T>> {
    return this._http.post<IApiResponse<T>>(
      `${this._baseUrl}/auth/register`,
      userData,
      { withCredentials: true }
    );
  }

  otpSubmit<T>(otpData: { email: string; otp: number }) {
    return this._http.patch<IApiResponse<T>>(
      `${this._baseUrl}/otp/submit`,
      otpData,
      { withCredentials: true }
    );
  }
}
