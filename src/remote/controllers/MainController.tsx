import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainController extends React.Component {
  state = {
    vm: new app.MainViewModel()
  };

  render() {
    return (
      <app.RefreshComponent onRefresh={() => this.state.vm.refreshAsync()}>
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <app.HeaderComponent title={language.remote}
          icon={<app.MainIconComponent vm={this.state.vm} />}
          onBack={() => app.core.dialog.disconnectAsync()}
          onSearch={(value) => this.state.vm.changeSearchAsync(value)}>
          <app.FooterComponent>
            <app.MainView vm={this.state.vm} />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.RefreshComponent>
    );
  }
}
