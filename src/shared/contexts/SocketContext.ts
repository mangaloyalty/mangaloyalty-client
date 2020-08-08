import * as app from '..';

export class SocketContext implements app.ISocketContext {
  private readonly _baseUrl: string;
  private readonly _queueHandlers: ((action: app.ISocketAction) => void)[];
  private _socket?: WebSocket;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
    this._queueHandlers = [];
  }

  attach() {
    if (this._socket) return;
    this._socket = new WebSocket(this._baseUrl.replace(/^http/, 'ws'));
    this._socket.addEventListener('close', () => this._onClose());
    this._socket.addEventListener('message', (ev) => this._onAction(JSON.parse(ev.data)));
    this._socket.addEventListener('open', () => this._onAction({type: 'SocketConnect'}));
  }

  detach() {
    const socket = this._socket;
    delete this._socket;
    socket?.close();
  }

  createQueue() {
    return new app.SocketQueue(this._queueHandlers);
  }

  private _onClose() {
    if (!this._socket) return;
    delete this._socket;
    this.attach();
  }

  private _onAction(action: app.ISocketAction) {
    this._queueHandlers.forEach((queueHandler) => queueHandler(action));
  }
}
