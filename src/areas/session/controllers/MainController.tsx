import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
const core = app.core;

@mobxReact.observer
export class MainController extends React.Component {
  state = {
    vm: new area.MainViewModel()
  };

  render() {
    return (
      <app.RefreshComponent onRefresh={() => this.state.vm.refreshAsync()}>
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <app.HeaderComponent title={app.language.app} 
          menu={<area.MenuComponent onRefresh={() => this.state.vm.refreshAsync()} />}
          onBack={() => core.screen.changeRoot(app.RootType.Connect)}>
          <app.FooterComponent>
            <area.MainView vm={this.state.vm} />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.RefreshComponent>
    );
  }
}
