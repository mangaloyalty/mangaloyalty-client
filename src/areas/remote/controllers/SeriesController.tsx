import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{title: string, url: string}> {
  state = {
    vm: new area.SeriesViewModel(this.props.title, this.props.url)
  };

  render() {
    return (
      <app.FocusComponent onFocus={() => !app.dialogManager.dialogs.length && this.state.vm.refreshAsync()}>
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <app.HeaderComponent title={this.state.vm.title}
          menu={<area.RefreshComponent onRefresh={() => this.state.vm.refreshAsync()} />}
          onBack={() => app.screenManager.close()}>
          <area.SeriesView vm={this.state.vm} />
        </app.HeaderComponent>
      </app.FocusComponent>
    );
  }
}
