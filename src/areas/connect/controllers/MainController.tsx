import * as app from '../../..';
import * as area from '..';
import * as React from 'react';

export class MainController extends React.Component {
  render() {
    return (
      <app.HeaderComponent title={app.language.title}>
        <area.MainView />
      </app.HeaderComponent>
    );
  }
}
