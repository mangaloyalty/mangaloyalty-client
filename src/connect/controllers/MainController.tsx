import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainController extends React.Component {
  state = {
    vm: new app.MainViewModel()
  }

  render() {
    return (
      <mui.Grid>
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <app.MainView vm={this.state.vm} />
      </mui.Grid>
    );
  }
}
