import * as app from '../../..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class RefreshIconComponent extends React.Component<{onRefresh: () => void}> {
  render() {
    return (
      <mui.IconButton color="inherit" onClick={() => this.props.onRefresh()}>
        <app.icons.Refresh />
      </mui.IconButton>
    );
  }
}
