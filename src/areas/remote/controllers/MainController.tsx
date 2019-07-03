import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class MainController extends React.Component {
  state = {
    vm: new area.MainViewModel()
  };

  render() {
    return (
      <app.FocusComponent onFocus={() => !app.dialogManager.dialogs.length && this.state.vm.refreshAsync()}>
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <app.HeaderComponent title={app.language.app}
          menu={<area.RefreshComponent onRefresh={() => this.state.vm.refreshAsync()} />}
          onBack={() => app.screenManager.changeRoot(app.RootType.Connect)}
          onSearch={(value) => this.state.vm.changeSearchTitle(value)}>
          <app.FooterComponent>
            <area.MainView vm={this.state.vm} />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.FocusComponent>
    );
  }
}
