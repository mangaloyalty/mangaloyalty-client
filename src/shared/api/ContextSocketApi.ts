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
    this._socket.on('action', this._onAction.bind(this));
    this._socket.on('reconnect', this._onReconnect.bind(this));
  }

  createAttachQueue() {
    return new app.ContextSocketQueue(this._queueHandlers);
  }

  private _onAction(action: app.ISocketAction) {
    this._queueHandlers.forEach((handler) => handler(action));
  }

  private _onReconnect() {
    this._onAction({type: 'SocketConnect'});
  }
}
