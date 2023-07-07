import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class UwsIoAdapter extends IoAdapter {
  public createIOServer(port: number, options?: any): any {
    if (this.httpServer && port === 0) {
      const isUWS = this.httpServer.inner.constructor.name === 'uWS.App';
      if (isUWS) {
        Logger.debug('⚡ Superpowers enabled', 'uWebSockets.js');
        const _server = new Server(options);
        _server.attachApp(this.httpServer.inner);
        return _server;
      } else {
        return new Server(this.httpServer, options);
      }
    }
    return new Server(port, options);
  }
}
