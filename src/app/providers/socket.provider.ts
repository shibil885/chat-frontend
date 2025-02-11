import { Socket, SocketIoConfig } from 'ngx-socket-io';

const socketConfig: SocketIoConfig = {
  url: 'http://localhost:4000',
  options: { withCredentials: true },
};

export const SOCKET_INSTANCE = new Socket(socketConfig);

export const SOCKET_PROVIDER = {
  provide: Socket,
  useValue: SOCKET_INSTANCE,
};
