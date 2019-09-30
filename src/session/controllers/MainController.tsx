import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainController extends React.Component<{vm: app.MainViewModel}> {
  static createConstruct(navigator: app.INavigator, session: app.ISessionListItem, title: string, pageNumber?: number) {
    return async () => {
      const vm = new app.MainViewModel(navigator, session, title, pageNumber);
      await vm.updateAsync();
      return <MainController vm={vm} />;
    };
  }

  render() {
    return (
      <mui.Grid>
        {this.props.vm.showControls && <app.HeaderComponent title={this.props.vm.title}
          icon={<app.MainIconComponent vm={this.props.vm} />}
          onBack={() => app.core.screen.leaveAsync()} />}
        <app.MainView vm={this.props.vm} />
      </mui.Grid>
    );
  }
}
