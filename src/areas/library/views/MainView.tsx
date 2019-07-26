import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainView extends React.Component<{vm: area.MainViewModel}> {
  render() {
    return (
      <mui.Grid>
        {this.props.vm.series && <mui.Grid>
          <app.SeriesListComponent
            emptyBody={app.language.libraryEmptyBody}
            emptyTitle={app.language.libraryEmptyTitle}
            series={this.props.vm.series.items}
            onClick={(series) => this.props.vm.open(series)} />
        </mui.Grid>}
      </mui.Grid>
    );
  }
}
