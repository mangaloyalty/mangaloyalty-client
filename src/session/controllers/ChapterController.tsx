import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ChapterController extends React.Component<{navigator?: app.INavigator, pageNumber?: number, session: app.ISessionListItem, title: string}> {
  state = {
    vm: new app.ChapterViewModel(this.props.session, this.props.navigator, this.props.pageNumber)
  };

  render() {
    return (
      <mui.Grid>
        {this.state.vm.showControls && <app.HeaderComponent title={this.props.title}
          icon={this.props.navigator && <app.ChapterIconComponent vm={this.state.vm} />}
          onBack={() => app.core.screen.close()} />}
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <app.ChapterView vm={this.state.vm} />
      </mui.Grid>
    );
  }
}
