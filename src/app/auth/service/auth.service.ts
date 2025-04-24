import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_Token');
  }

  logout() {
    localStorage.removeItem('access_Token');
    this.router.navigate(['auth']);
  }
}
