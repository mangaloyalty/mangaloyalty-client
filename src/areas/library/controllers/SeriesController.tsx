import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{series: app.ILibrarySeries}> {
  state = {
    vm: new area.SeriesViewModel(this.props.series)
  };

  render() {
    return (
      <app.RefreshComponent onRefresh={() => this.state.vm.refreshAsync()}>
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <app.HeaderComponent title={this.state.vm.title}
          icon={<area.SeriesIconComponent vm={this.state.vm} />}
          onBack={() => app.core.screen.close()}>
          <area.SeriesView vm={this.state.vm} />
        </app.HeaderComponent>
      </app.RefreshComponent>
    );
  }
}
