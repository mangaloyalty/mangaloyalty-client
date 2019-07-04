import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ChapterController extends React.Component<{pageNumber: number, session: app.ISessionListItem}> {
  state = {
    vm: new area.ChapterViewModel(this.props.pageNumber, this.props.session)
  };

  render() {
    return (
      <mui.Grid>
        {this.state.vm.isHeaderVisible && <app.HeaderComponent title={app.language.app}
          onBack={() => app.core.screen.close()} />}
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <area.ChapterView vm={this.state.vm} />
      </mui.Grid>
    );
  }
}
