import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ChapterController extends React.Component<{vm: app.ChapterViewModel}> {
  static createConstruct(session: app.ISessionListItem, title: string, navigator?: app.INavigator, pageNumber?: number) {
    return async () => {
      const vm = new app.ChapterViewModel(session, title, navigator, pageNumber);
      await vm.updateAsync();
      return <ChapterController vm={vm} />;
    };
  }

  render() {
    return (
      <mui.Grid>
        {this.props.vm.showControls && <app.HeaderComponent title={this.props.vm.title}
          icon={this.props.vm.showNavigator ? <app.ChapterIconComponent vm={this.props.vm} /> : undefined}
          onBack={() => app.core.screen.leaveAsync()} />}
        <app.ChapterView vm={this.props.vm} />
      </mui.Grid>
    );
  }
}
