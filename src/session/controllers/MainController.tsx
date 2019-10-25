import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainController extends React.Component<{queue: app.ContextSocketQueue, vm: app.MainViewModel}> {
  static createConstruct(navigator: app.INavigator, session: app.ISessionListItem, title: string, pageNumber?: number) {
    return async () => {
      const queue = app.api.socket.createAttachQueue();
      const vm = new app.MainViewModel(navigator, session, title, pageNumber);
      await vm.updateAsync();
      return <MainController queue={queue} vm={vm} />;
    };
  }

  render() {
    return (
      <mui.Grid>
        {this.props.vm.showControls && <app.HeaderComponent title={this.props.vm.title}
          icon={<app.MainIconComponent vm={this.props.vm} />}
          onBack={() => app.core.screen.leaveAsync()} />}
        <app.ActionComponent queue={this.props.queue} onActionAsync={(action) => this.props.vm.socketActionAsync(action)} />
        <app.MainView vm={this.props.vm} />
      </mui.Grid>
    );
  }
}
