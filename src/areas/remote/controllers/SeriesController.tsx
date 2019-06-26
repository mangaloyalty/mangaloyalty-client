import * as app from '../../..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SeriesController extends React.Component<{title: string, url: string}> {
  state = {
    // vm: new area.SeriesViewModel()
  };

  render() {
    return (
      <mui.Grid onClick={() => app.screenManager.pop()}>
        {this.props.title} - {this.props.url}
      </mui.Grid>
    );
  }
}
