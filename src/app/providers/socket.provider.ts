import { SocketIoConfig, Socket } from 'ngx-socket-io';

const socketConfig: SocketIoConfig = {
  url: import.meta.env.NG_APP_BASE_URL,
  options: {
    withCredentials: true,
    autoConnect: false,
  },
};

export const SOCKET_PROVIDER = {
  provide: Socket,
  useFactory: () => new Socket(socketConfig),
};
