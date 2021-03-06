import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainController extends React.Component<{queue: app.ActionQueue, vm: app.MainViewModel}> {
  static createConstruct(navigator: app.INavigator, pageNumber: number, session: app.ISessionListItem, title: string) {
    return async () => {
      const queue = app.core.context.action.poll.queue().attach();
      const vm = new app.MainViewModel(navigator, session, title, pageNumber);
      await vm.updateAsync();
      return <MainController queue={queue} vm={vm} />;
    };
  }

  render() {
    return (
      <mui.Grid>
        {this.props.vm.showControls && <app.HeaderTitleComponent icon={<app.MainIconComponent vm={this.props.vm} />} title={this.props.vm.title} />}
        <app.ActionComponent queue={this.props.queue} onActionAsync={(actions) => this.props.vm.socketActionAsync(actions)} />
        <app.MainSettingsView vm={this.props.vm.settings} />
        <app.MainView vm={this.props.vm} />
      </mui.Grid>
    );
  }
}
