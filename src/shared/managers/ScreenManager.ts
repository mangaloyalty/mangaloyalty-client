import * as mobx from 'mobx';
import * as React from 'react';

export class ScreenManager {
  private _isConstructing = false;
  private _shouldCancel = false;

  constructor() {
    this.views = [];
  }

  @mobx.action
  async leaveAsync() {
    if (this._isConstructing) {
      this._shouldCancel = true;
    } else if (this.views.pop() && this.views.length) {
      const topView = this.views.pop()!;
      await this._replaceAsync(() => topView.constructAsync(topView.restoreState), undefined, topView.restoreX, topView.restoreY);
    } else {
      this.presentView = undefined;
    }
  }

  @mobx.action
  async loadAsync<T>(runAsync: () => Promise<T>) {
    try {
      this.loadCount++;
      return await runAsync();
    } finally {
      this.loadCount--;
    }
  }

  @mobx.action
  async openAsync(constructAsync: () => Promise<React.ReactElement>) {
    while (this.views.length > 0) this.views.pop();
    return await this._replaceAsync(constructAsync);
  }

  @mobx.action
  async openChildAsync(constructAsync: () => Promise<React.ReactElement>, restoreState?: any) {
    return await this._replaceAsync(constructAsync, restoreState);
  }

  @mobx.action
  async replaceChildAsync(constructAsync: () => Promise<React.ReactElement>, restoreState?: any) {
    this.views.pop();
    return await this._replaceAsync(constructAsync, restoreState);
  }

  @mobx.observable
  loadCount = 0;

  @mobx.observable
  presentView?: {
    element: React.ReactElement,
    x?: number,
    y?: number
  };
  
  @mobx.observable
  views: {
    constructAsync: (restoreState?: any) => Promise<React.ReactElement>,
    restoreState?: any,
    restoreX?: number,
    restoreY?: number
  }[];

  private async _replaceAsync(constructAsync: () => Promise<React.ReactElement>, restoreState?: any, currentX?: number, currentY?: number) {
    return await this.loadAsync(async () => {
      this._isConstructing = true;
      const element = await constructAsync();
      this._isConstructing = false;
      if (this._shouldCancel) {
        this._shouldCancel = false;
        return true;
      } else {
        const previous = this.views.length && this.views[this.views.length - 1];
        if (previous) previous.restoreState = restoreState;
        if (previous) previous.restoreX = scrollX;
        if (previous) previous.restoreY = scrollY;
        this.presentView = {element, x: currentX, y: currentY};
        this.views.push({constructAsync});
        return false;
      }
    });
  }
}
