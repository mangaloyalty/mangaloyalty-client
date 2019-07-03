import * as app from '../../..';
import * as area from '..';
import * as React from 'react';

export class MainController extends React.Component {
  render() {
    return (
      <app.FocusComponent onFocus={() => !app.dialogManager.dialogs.length && this._onFocus()}>
        <app.HeaderComponent title={app.language.app} onBack={() => app.screenManager.changeRoot(app.RootType.Connect)}>
          <app.FooterComponent>
            <area.MainView />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.FocusComponent>
    );
  }

  private _onFocus() {
    // Replace me for inline when implementing this library.
  }
}
