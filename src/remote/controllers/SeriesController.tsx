import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{queue: app.ActionQueue, vm: app.SeriesViewModel}> {
  static createConstruct(url: string) {
    return async (restoreState?: app.SeriesRestoreState) => {
      const queue = app.core.context.action.poll.queue().attach();
      const vm = new app.SeriesViewModel(url, restoreState);
      await vm.refreshAsync();
      return <SeriesController queue={queue} vm={vm} />;
    };
  }

  render() {
    return (
      <app.HeaderTitleComponent title={this.props.vm.title}>
        <app.ActionComponent queue={this.props.queue} onActionAsync={(actions) => this.props.vm.socketActionAsync(actions)} />
        <app.SeriesView vm={this.props.vm} />
      </app.HeaderTitleComponent>
    );
  }
}
