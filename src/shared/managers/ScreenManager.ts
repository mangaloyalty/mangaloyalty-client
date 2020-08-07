import * as mobx from 'mobx';
import * as React from 'react';

export class ScreenManager {
  constructor() {
    this.views = [];
  }

  @mobx.action
  async leaveAsync() {
    this.views.pop();
    if (this.views.length) {
      const topView = this.views[this.views.length - 1];
      await this._replaceAsync(topView.constructAsync, topView.restoreState, topView.restoreX, topView.restoreY);
    } else {
      delete this.presentView;
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
    this.views.push({constructAsync});
    await this._replaceAsync(constructAsync);
  }

  @mobx.action
  async openChildAsync(constructAsync: () => Promise<React.ReactElement>, restoreState?: any) {
    this._saveState(restoreState);
    this.views.push({constructAsync});
    await this._replaceAsync(constructAsync);
  }

  @mobx.action
  async replaceChildAsync(constructAsync: () => Promise<React.ReactElement>) {
    this.views.pop();
    this.views.push({constructAsync});
    await this._replaceAsync(constructAsync);
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

  private async _replaceAsync(constructAsync: (restoreState?: any) => Promise<React.ReactElement>, restoreState?: any, restoreX?: number, restoreY?: number) {
    await this.loadAsync(async () => {
      const element = await constructAsync(restoreState);
      const elementView = this.views.length >= 1 && this.views[this.views.length - 1];
      if (elementView && elementView.constructAsync === constructAsync) this.presentView = {element, x: restoreX, y: restoreY};
    });
  }
  
  private _saveState(restoreState?: any) {
    const previous = this.views.length >= 1 && this.views[this.views.length - 1];
    if (previous) previous.restoreState = restoreState;
    if (previous) previous.restoreX = scrollX;
    if (previous) previous.restoreY = scrollY;
  }
}
