import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ChapterController extends React.Component<{vm: app.ChapterViewModel}> {
  static createConstruct(navigator: app.INavigator, session: app.ISessionListItem, title: string, pageNumber?: number) {
    return async () => {
      const vm = new app.ChapterViewModel(navigator, session, title, pageNumber);
      await vm.updateAsync();
      return <ChapterController vm={vm} />;
    };
  }

  render() {
    return (
      <mui.Grid>
        {this.props.vm.showControls && <app.HeaderComponent title={this.props.vm.title}
          icon={<app.ChapterIconComponent vm={this.props.vm} />}
          onBack={() => app.core.screen.leaveAsync()} />}
        <app.ChapterView vm={this.props.vm} />
      </mui.Grid>
    );
  }
}
