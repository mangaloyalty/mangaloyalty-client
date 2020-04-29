import * as app from '..';

export class SocketQueue implements app.ISocketQueue {
  private readonly _actionHandler: (action: app.ISocketAction) => void;
  private readonly _actionQueue: app.ISocketAction[];
  private readonly _queueHandlers: ((action: app.ISocketAction) => void)[];
  private _consumeAsync?: (actions: app.ISocketAction[]) => Promise<void>;
  private _isRunning?: boolean;
  private _timeout?: NodeJS.Timeout;

  constructor(queueHandlers: ((action: app.ISocketAction) => void)[]) {
    this._actionHandler = (action) => this._onAction(action);
    this._actionQueue = [];
    this._queueHandlers = queueHandlers;
  }
  
  attach() {
    const index = this._queueHandlers.indexOf(this._actionHandler);
    if (index === -1) {
      this._timeout = setTimeout(() => this.detach(), app.settings.socketMountTimeout);
      this._queueHandlers.push(this._actionHandler);
      return this;
    } else {
      return this;
    }
  }

  detach() {
    const index = this._queueHandlers.indexOf(this._actionHandler);
    if (index !== -1) {
      this._clearTimeout();
      this._queueHandlers.splice(index, 1);
      return this;
    } else {
      return this;
    }
  }

  mount(consumeAsync: (actions: app.ISocketAction[]) => Promise<void>) {
    if (this._consumeAsync) return;
    this._clearTimeout();
    this._consumeAsync = consumeAsync;
    this._run();
  }

  private _clearTimeout() {
    if (!this._timeout) return;
    clearTimeout(this._timeout);
    delete this._timeout;
  }

  private _onAction(action: app.ISocketAction) {
    this._actionQueue.push(action);
    this._run();
  }

  private _onEnd() {
    this._isRunning = false;
    this._run();
  }

  private _run() {
    if (!this._actionQueue.length || !this._consumeAsync || this._isRunning) return;
    const endHandler = () => this._onEnd();
    this._isRunning = true;
    this._consumeAsync(this._actionQueue.splice(0, this._actionQueue.length)).then(endHandler, endHandler);
  }
}
