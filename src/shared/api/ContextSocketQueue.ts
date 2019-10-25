import * as app from '..';

export class ContextSocketQueue {
  private readonly _actionHandler: (action: app.ISocketAction) => void;
  private readonly _actionQueue: app.ISocketAction[];
  private readonly _queueHandlers: ((action: app.ISocketAction) => void)[];
  private _consumeAsync?: (actions: app.ISocketAction[]) => Promise<void>;
  private _isRunning?: boolean;

  constructor(queueHandlers: ((action: app.ISocketAction) => void)[]) {
    this._actionHandler = (action) => this._onAction(action);
    this._actionQueue = [];
    this._queueHandlers = queueHandlers;
  }
  
  attach() {
    const index = this._queueHandlers.indexOf(this._actionHandler);
    if (index === -1) this._queueHandlers.push(this._actionHandler);
    return this;
  }

  detach() {
    const index = this._queueHandlers.indexOf(this._actionHandler);
    if (index !== -1) this._queueHandlers.splice(index, 1);
    return this;
  }

  mount(consumeAsync: (actions: app.ISocketAction[]) => Promise<void>) {
    if (this._consumeAsync) return;
    this._consumeAsync = consumeAsync;
    this._tryRun();
  }

  private _onAction(action: app.ISocketAction) {
    this._actionQueue.push(action);
    this._tryRun();
  }

  private _onEnd() {
    this._isRunning = false;
    this._tryRun();
  }

  private _tryRun() {
    if (!this._actionQueue.length || !this._consumeAsync || this._isRunning) return;
    const endHandler = () => this._onEnd();
    this._isRunning = true;
    this._consumeAsync(this._actionQueue.splice(0, this._actionQueue.length)).then(endHandler, endHandler);
  }
}
