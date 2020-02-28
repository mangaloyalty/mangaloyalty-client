import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{queue: app.ContextSocketQueue, vm: app.SeriesViewModel}> {
  static createConstruct(url: string) {
    return async (restoreState?: app.SeriesRestoreState) => {
      const queue = app.api.socket.createQueue().attach();
      const vm = new app.SeriesViewModel(url, restoreState);
      await vm.refreshAsync();
      return <SeriesController queue={queue} vm={vm} />;
    };
  }

  render() {
    return (
      <app.HeaderTitleComponent title={this.props.vm.title}
        onBack={() => app.core.screen.leaveAsync()}>
        <app.ActionComponent queue={this.props.queue} onActionAsync={(actions) => this.props.vm.socketActionAsync(actions)} />
        <app.SeriesView vm={this.props.vm} />
      </app.HeaderTitleComponent>
    );
  }
}
