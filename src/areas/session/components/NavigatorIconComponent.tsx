import * as app from '../../..';
import * as area from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class NavigatorIconComponent extends React.Component<{vm: area.ChapterViewModel}> {
  render() {
    return (
      <mui.Grid>
        <mui.IconButton color="inherit" onClick={() => this.props.vm.chapterNextAsync()}>
          <app.icons.ArrowBack />
        </mui.IconButton>
        <mui.IconButton color="inherit" onClick={() => this.props.vm.chapterPreviousAsync()}>
          <app.icons.ArrowForward />
        </mui.IconButton>
      </mui.Grid>
    );
  }
}
