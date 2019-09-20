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
      const topView = this.views.pop()!;
      await this._openAsync(topView.constructAsync, topView.restoreX, topView.restoreY);
    } else {
      this.presentView = undefined;
    }
  }

  @mobx.action
  async openAsync(constructAsync: () => Promise<React.ReactElement>) {
    while (this.views.length > 0) this.views.pop();
    await this._openAsync(constructAsync);
  }

  @mobx.action
  async openChildAsync(constructAsync: () => Promise<React.ReactElement>) {
    await this._openAsync(constructAsync);
  }

  @mobx.action
  async replaceChildAsync(constructAsync: () => Promise<React.ReactElement>) {
    this.views.pop();
    await this._openAsync(constructAsync);
  }

  @mobx.observable
  presentView?: {element: React.ReactElement, x?: number, y?: number};
  
  @mobx.observable
  views: {constructAsync(): Promise<React.ReactElement>, restoreX?: number, restoreY?: number}[];

  @mobx.observable
  isLoading = false;

  private async _openAsync(constructAsync: () => Promise<React.ReactElement>, x?: number, y?: number) {
    this.isLoading = true;
    const element = await constructAsync();
    const previous = this.views.length && this.views[this.views.length - 1];
    if (previous) previous.restoreX = scrollX;
    if (previous) previous.restoreY = scrollY;
    this.presentView = {element, x, y};
    this.views.push({constructAsync});
    this.isLoading = false;
  }
}
