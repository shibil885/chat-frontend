import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuardFn: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoginRoute =
    route.routeConfig?.path === 'auth'
      ? true
      : route.routeConfig?.path === ''
      ? true
      : false;

  if (isLoginRoute) {
    if (authService.isLoggedIn()) {
      router.navigate(['/home']);
      return false;
    }
  } else {
    if (!authService.isLoggedIn()) {
      router.navigate(['/auth']);
      return false;
    }
  }
  return true;
};
