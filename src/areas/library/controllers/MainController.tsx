import * as app from '../../..';
import * as area from '..';
import * as React from 'react';

export class MainController extends React.Component {
  render() {
    return (
      <app.FocusComponent onFocus={() => this._onFocus()}>
        <app.HeaderComponent title={app.language.title} showDisconnect={true}>
          <app.FooterComponent>
            <area.MainView />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.FocusComponent>
    );
  }

  private _onFocus() {
    if (app.dialogManager.hasDialog) return;
  }
}
