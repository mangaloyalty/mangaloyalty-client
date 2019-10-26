import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainController extends React.Component<{queue: app.ContextSocketQueue, vm: app.MainViewModel}> {
  static createConstruct(search?: string) {
    return async (restoreState?: app.MainRestoreState) => {
      const queue = app.api.socket.createQueue().attach();
      const vm = new app.MainViewModel(search, restoreState);
      await vm.refreshAsync();
      return <MainController queue={queue} vm={vm} />;
    };
  }

  render() {
    return (
      <app.HeaderComponent defaultSearch={this.props.vm.search} title={language.library}
        icon={<app.MainIconComponent vm={this.props.vm} />}
        onSearch={(value) => this.props.vm.changeSearchAsync(value)}>
        <app.ActionComponent queue={this.props.queue} onActionAsync={(action) => this.props.vm.socketActionAsync(action)} />
        <app.MainView vm={this.props.vm} />
      </app.HeaderComponent>
    );
  }
}
