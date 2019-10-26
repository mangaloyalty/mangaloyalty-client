import * as app from '..';
import * as io from 'socket.io-client';

export class ContextSocketApi {
  private readonly _baseUrl: string;
  private readonly _queueHandlers: ((action: app.ISocketAction) => void)[];
  private _socket?: SocketIOClient.Socket;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
    this._queueHandlers = [];
  }

  attach() {
    if (this._socket) return;
    this._socket = io.connect(this._baseUrl);
    this._socket.on('action', (action: app.ISocketAction) => this._onAction(action));
    this._socket.on('reconnect', () => this._onReconnect());
  }

  createQueue() {
    return new app.ContextSocketQueue(this._queueHandlers);
  }

  private _onAction(action: app.ISocketAction) {
    this._queueHandlers.forEach((queueHandler) => queueHandler(action));
  }

  private _onReconnect() {
    this._onAction({type: 'SocketConnect'});
  }
}
