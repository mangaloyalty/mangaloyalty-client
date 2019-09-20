import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class MainController extends React.Component<{vm: app.MainViewModel}> {
  static async constructAsync() {
    const vm = new app.MainViewModel();
    return <MainController vm={vm} />;
  }

  render() {
    return (
      <app.MainView vm={this.props.vm} />
    );
  }
}
