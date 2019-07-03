import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
const core = app.core;

@mobxReact.observer
export class MainController extends React.Component {
  render() {
    return (
      <app.RefreshComponent onRefresh={() => { /* DON'T FORGET ME */ }}>
        <app.HeaderComponent title={app.language.app} onBack={() => core.screen.changeRoot(app.RootType.Connect)}>
          <app.FooterComponent>
            <area.MainView />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.RefreshComponent>
    );
  }
}
