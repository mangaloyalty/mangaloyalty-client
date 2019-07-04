import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

// TODO: Implement me.

@mobxReact.observer
export class MainController extends React.Component {
  render() {
    return (
      <app.HeaderComponent title={app.language.app}>
        <area.MainView />
      </app.HeaderComponent>
    );
  }
}
