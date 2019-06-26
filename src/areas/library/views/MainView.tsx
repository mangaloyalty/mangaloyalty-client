import * as app from '../../..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class MainView extends React.Component {
  render() {
    return (
      <app.CenterComponent
        body="The library is not available in this preview build. Please check back later!"
        title="入手不可能" />
    );
  }
}
