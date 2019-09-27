import * as mobx from 'mobx';
import {language} from '../language';

export class DialogManager {
  constructor() {
    this.items = [];
  }

  @mobx.action
  async completeAsync() {
    await this._openAsync(language.completeBody, language.completeButtons);
  }

  @mobx.action
  async confirmDeleteAsync() {
    return await this._openAsync(language.confirmDeleteBody, language.confirmDeleteButtons).then(Boolean);
  }

  @mobx.action
  async confirmDisconnectAsync() {
    return await this._openAsync(language.confirmDisconnectBody, language.confirmDisconnectButtons).then(Boolean);
  }

  @mobx.action
  async connectAsync() {
    await this._openAsync(language.connectBody, language.connectButtons);
  }

  @mobx.action
  async errorAsync(...errors: any[]) {
    await this._openAsync(language.errorBody, language.errorButtons, ...errors);
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
