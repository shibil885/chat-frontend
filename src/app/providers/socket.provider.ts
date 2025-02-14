import { Socket, SocketIoConfig } from 'ngx-socket-io';

const socketConfig: SocketIoConfig = {
  url: import.meta.env.NG_APP_BASE_URL,
  options: { withCredentials: true },
};

export const SOCKET_INSTANCE = new Socket(socketConfig);

export const SOCKET_PROVIDER = {
  provide: Socket,
  useValue: SOCKET_INSTANCE,
};
