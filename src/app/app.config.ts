import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { httpInterceptorFn } from './interceptors/error.inerceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SOCKET_PROVIDER } from './providers/socket.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([httpInterceptorFn])),
    provideAnimationsAsync(),
    SOCKET_PROVIDER,
  ],
};
