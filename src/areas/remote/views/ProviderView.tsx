import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ProviderView extends React.Component<{vm: area.ProviderViewModel}> {
  render() {
    return (
      <mui.Grid>
        {this.props.vm.series && <mui.Grid key={this.props.vm.name}>
          <app.SeriesListComponent
            emptyBody={app.language.remoteEmptyBody}
            emptyTitle={app.language.remoteEmptyTitle}
            series={this.props.vm.series.items}
            onClick={(series) => this.props.vm.openAsync(series.url)} />
        </mui.Grid>}
      </mui.Grid>
    );
  }
}
