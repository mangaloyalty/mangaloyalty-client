import * as mobx from 'mobx';
import {language} from '../language';

export class DialogManager {
  constructor() {
    this.items = [];
  }

  @mobx.action
  async addedAsync() {
    await this._openAsync(language.addedBody, language.addedButtons);
  }

  @mobx.action
  async deleteAsync() {
    return await this._openAsync(language.deleteBody, language.deleteButtons).then(Boolean);
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
