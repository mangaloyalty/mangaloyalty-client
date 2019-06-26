import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

// TODO: Support infinite scroll while pages are available.
@mobxReact.observer
export class ProviderView extends React.Component<{vm: area.ProviderViewModel}> {
  render() {
    return (
      <mui.Grid>
        <app.LoadingComponent open={this.props.vm.isLoading} />
        {this.props.vm.seriesList && <mui.Grid key={this.props.vm.name}>
          <app.SeriesListComponent
            seriesList={this.props.vm.seriesList}
            onClick={(seriesListItem) => this._onClick(seriesListItem)} />
        </mui.Grid>}
      </mui.Grid>
    );
  }

  private _onClick(seriesListItem: app.ISeriesListItem) {
    // TODO: Open series.
    console.log(seriesListItem);
  }
}
