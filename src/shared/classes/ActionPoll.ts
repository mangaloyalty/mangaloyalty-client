import * as app from '..';

export class ActionPoll {
  private readonly _queueHandlers: ((actionList: app.IClientActionList) => void)[];
  private _isAttached: boolean;

  constructor() {
    this._isAttached = false;
    this._queueHandlers = [];
  }

  attach(actionList: app.IActionList) {
    this._isAttached = true;
    (async () => {
      let previousResponseAt = actionList.responseAt;
      while (this._isAttached) {
        const actionList = await app.core.context.action.listReadAsync(true, previousResponseAt);
        if (!this._isAttached) {
          break;
        } else if (actionList.value) {
          const values = actionList.value.items.map(x => x.data);
          this._queueHandlers.forEach((queueHandler) => queueHandler(values));
          previousResponseAt = actionList.value.responseAt;
        } else while (this._isAttached) {
          const nextActionList = await app.core.context.action.listReadAsync(false);
          if (nextActionList.value) {
            this._queueHandlers.forEach((queueHandler) => queueHandler([{type: 'SocketConnect'}]))
            previousResponseAt = nextActionList.value.responseAt;
            break;
          }
        }
      }
    })();
  }

  detach() {
    this._isAttached = false;
  }

  queue() {
    return new app.ActionQueue(this._queueHandlers);
  }
}
