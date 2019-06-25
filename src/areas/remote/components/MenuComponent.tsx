import * as app from '../../..';
import * as area from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class MenuComponent extends React.Component<{vm: area.MainViewModel}> {
  render() {
    return (
      <mui.MenuItem onClick={() => this.props.vm.refreshAsync()}>
        <mui.ListItemIcon>
          <app.icons.Refresh />
        </mui.ListItemIcon>
        <mui.Typography>
          {app.language.refresh}
        </mui.Typography>
      </mui.MenuItem>
    );
  }
}
