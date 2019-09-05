import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class DialogManager {
  constructor() {
    this.items = [];
  }

  @mobx.action
  async connectAsync() {
    return await this._openAsync(language.connectBody, language.connectButtons).then(() => {
      return true;
    });
  }
  
  @mobx.action
  async disconnectAsync() {
    return await this._openAsync(language.disconnectBody, language.disconnectButtons).then((index) => {
      if (index) return true;
      app.core.screen.changeRoot(app.RootType.Connect);
      return false;
    });
  }

  @mobx.action
  async errorAsync(shouldClose: boolean, ...errors: any[]) {
    return await this._openAsync(language.errorBody, language.errorButtons, ...errors).then((index) => {
      if (index) return true;
      if (shouldClose && app.core.screen.isChildVisible) app.core.screen.close();
      else if (shouldClose) app.core.screen.changeRoot(app.RootType.Connect);
      return false;
    });
  }

  @mobx.computed
  get isChildVisible() {
    return this.items.length !== 0;
  }

  @mobx.observable
  items: {
    body: string;
    buttons: string[];
    errorTexts: string[];
    id: number;
    send: (index: number) => void;
  }[];

  private async _openAsync(body: string, buttons: string[], ...errors: any[]) {
    return await new Promise<number>((resolve) => {
      const id = this.items.length + 1;
      const errorTexts = errors.map(convertErrorText).filter(Boolean).map((errorText) => errorText!);
      this.items.push({body, buttons, errorTexts, id, send: (index: number) => {
        this.items.pop();
        resolve(index);
      }});
    });
  }
}

function convertErrorText(error?: any) {
  if (error instanceof Error) return error.stack;
  else if (error) return String(error) || undefined;
  else return;
}
