import * as app from '..';

export class ActionQueue {
  private readonly _currentHandler: (actionList: app.IClientActionList) => void;
  private readonly _queue: app.IClientActionList;
  private readonly _queueHandlers: ((actionList: app.IClientActionList) => void)[];
  private _consumeAsync?: (actionList: app.IClientActionList) => Promise<void>;
  private _isConsuming?: boolean;
  private _timeout?: NodeJS.Timeout;

  constructor(queueHandlers: ((actionList: app.IClientActionList) => void)[]) {
    this._currentHandler = (actions) => this._onReceive(actions);
    this._queue = [];
    this._queueHandlers = queueHandlers;
  }
  
  attach() {
    const index = this._queueHandlers.indexOf(this._currentHandler);
    if (index === -1) {
      this._queueHandlers.push(this._currentHandler);
      this._timeout = setTimeout(() => this.detach(), app.settings.socketMountTimeout);
      return this;
    } else {
      return this;
    }
  }

  detach() {
    const index = this._queueHandlers.indexOf(this._currentHandler);
    if (index !== -1) {
      this._clearTimeout();
      this._queueHandlers.splice(index, 1);
      return this;
    } else {
      return this;
    }
  }

  mount(consumeAsync: (actionList: app.IClientActionList) => Promise<void>) {
    if (this._consumeAsync) return;
    this._clearTimeout();
    this._consumeAsync = consumeAsync;
    this._tryConsume();
  }

  private _clearTimeout() {
    if (!this._timeout) return;
    clearTimeout(this._timeout);
    delete this._timeout;
  }

  private _onEnd() {
    this._isConsuming = false;
    this._tryConsume();
  }

  private _onReceive(actionList: app.IClientActionList) {
    this._queue.push(...actionList);
    this._tryConsume();
  }

  private _tryConsume() {
    if (!this._consumeAsync || this._isConsuming || !this._queue.length) return;
    this._isConsuming = true;
    this._consumeAsync(this._queue.splice(0, this._queue.length)).then(() => this._onEnd());
  }
}
