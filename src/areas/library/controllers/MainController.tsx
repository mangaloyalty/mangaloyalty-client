import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class MainController extends React.Component {
  render() {
    return (
      <app.RefreshComponent onRefresh={() => { /* DON'T FORGET ME */ }}>
        <app.HeaderComponent title={app.language.library} onBack={() => app.core.dialog.disconnectAsync()}>
          <app.FooterComponent>
            <area.MainView />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.RefreshComponent>
    );
  }
}
