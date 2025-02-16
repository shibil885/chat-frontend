import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AuthComponent } from './components/auth/auth.component';
import { ChatComponent } from './components/chat/chat.component';
import { authGuardFn } from './auth/guard/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [authGuardFn] },
  { path: 'auth', component: AuthComponent, canActivate: [authGuardFn] },
  { path: 'home', component: ChatComponent, canActivate: [authGuardFn] },
];
