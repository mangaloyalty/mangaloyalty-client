import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

// TODO: Support infinite scroll while pages are available.
// TODO: EmptyComponent does not respect parent claimed tab space.
@mobxReact.observer
export class ProviderView extends React.Component<{vm: area.ProviderViewModel}> {
  render() {
    return (
      <mui.Grid>
        <app.LoadingComponent open={this.props.vm.isLoading} />
        {this.props.vm.seriesList && <mui.Grid key={this.props.vm.name}>
          <app.SeriesListComponent
            emptyBody={app.language.remoteEmptyBody}
            emptyTitle={app.language.remoteEmptyTitle}
            seriesList={this.props.vm.seriesList}
            onClick={(seriesListItem) => app.screenManager.push(<area.SeriesController title={seriesListItem.title} url={seriesListItem.url} />)} />
        </mui.Grid>}
      </mui.Grid>
    );
  }
}
