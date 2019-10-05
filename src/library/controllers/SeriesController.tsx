import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{queue: app.ContextSocketQueue, vm: app.SeriesViewModel}> {
  static createConstruct(id: string) {
    return async (restoreState?: app.SeriesRestoreState) => {
      const queue = app.api.socket.createAttachQueue();
      const vm = new app.SeriesViewModel(id, restoreState);
      await vm.refreshAsync();
      return <SeriesController queue={queue} vm={vm} />;
    };
  }

  render() {
    return (
      <app.HeaderComponent title={this.props.vm.title}
        icon={<app.SeriesIconComponent vm={this.props.vm} />}
        onBack={() => app.core.screen.leaveAsync()}>
        <app.SocketComponent queue={this.props.queue} onActionAsync={(action) => this.props.vm.socketActionAsync(action)} />
        <app.SeriesView vm={this.props.vm} />
      </app.HeaderComponent>
    );
  }
}
