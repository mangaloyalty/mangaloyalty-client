import * as app from '../../..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class RefreshComponent extends React.Component<{onRefresh: () => void}> {
  render() {
    return (
      <mui.MenuItem onClick={() => this.props.onRefresh()}>
        <mui.ListItemIcon>
          <app.icons.Refresh />
        </mui.ListItemIcon>
        <mui.Typography>
          {app.language.menuTopRefresh}
        </mui.Typography>
      </mui.MenuItem>
    );
  }
}
