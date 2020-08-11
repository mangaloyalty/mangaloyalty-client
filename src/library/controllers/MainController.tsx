import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class MainController extends React.Component<{queue: app.ActionQueue, vm: app.MainViewModel}> {
  static createConstruct(search?: string) {
    return async (restoreState?: app.MainRestoreState) => {
      const queue = app.core.context.action.poll.queue().attach();
      const vm = new app.MainViewModel(search, restoreState);
      await vm.refreshAsync();
      return <MainController queue={queue} vm={vm} />;
    };
  }

  render() {
    return (
      <app.HeaderMainComponent defaultSearch={this.props.vm.search} onSearch={(value) => this.props.vm.changeSearchAsync(value)}>
        <app.ActionComponent queue={this.props.queue} onActionAsync={(actions) => this.props.vm.socketActionAsync(actions)} />
        <app.MainView vm={this.props.vm} />
      </app.HeaderMainComponent>
    );
  }
}
