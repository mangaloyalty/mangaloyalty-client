import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{id: string, title: string}> {
  state = {
    vm: new area.SeriesViewModel(this.props.id, this.props.title)
  };

  render() {
    return (
      <app.RefreshComponent onRefresh={() => this.state.vm.refreshAsync()}>
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <app.HeaderComponent title={this.state.vm.title}
          icon={<area.IconComponent onRead={() => this.state.vm.readAsync()} onRefresh={() => this.state.vm.refreshAsync()} />}
          onBack={() => app.core.screen.close()}>
          <area.SeriesView vm={this.state.vm} />
        </app.HeaderComponent>
      </app.RefreshComponent>
    );
  }
}
