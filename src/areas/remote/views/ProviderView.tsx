import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

// TODO: Support infinite scroll while pages are available.
// UX: EmptyComponent does not respect parent claimed tab space.
@mobxReact.observer
export class ProviderView extends React.Component<{vm: area.ProviderViewModel}> {
  render() {
    return (
      <mui.Grid>
        {this.props.vm.series && <mui.Grid key={this.props.vm.name}>
          <app.SeriesListComponent
            emptyBody={app.language.remoteEmptyBody}
            emptyTitle={app.language.remoteEmptyTitle}
            series={this.props.vm.series}
            onClick={(series) => this.props.vm.open(series)} />
        </mui.Grid>}
      </mui.Grid>
    );
  }
}
