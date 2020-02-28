import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{queue: app.ContextSocketQueue, vm: app.SeriesViewModel}> {
  static createConstruct(seriesId: string, showAutomation?: boolean) {
    return async (restoreState?: app.SeriesRestoreState) => {
      const queue = app.api.socket.createQueue().attach();
      const vm = new app.SeriesViewModel(seriesId, showAutomation, restoreState);
      await vm.refreshAsync();
      return <SeriesController queue={queue} vm={vm} />;
    };
  }

  render() {
    return (
      <app.HeaderTitleComponent title={this.props.vm.title}
        icon={<app.SeriesIconComponent vm={this.props.vm} />}
        onBack={() => app.core.screen.leaveAsync()}>
        <app.ActionComponent queue={this.props.queue} onActionAsync={(actions) => this.props.vm.socketActionAsync(actions)} />
        <app.SeriesAutomationView vm={this.props.vm.automation} />
        <app.SeriesView vm={this.props.vm} />
      </app.HeaderTitleComponent>
    );
  }
}
