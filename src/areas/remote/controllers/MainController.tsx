import * as app from '../../..';
import * as area from '..';
import * as React from 'react';

export class MainController extends React.Component {
  state = {
    vm: new area.MainViewModel()
  };

  render() {
    return (
      <app.FocusComponent onFocus={() => this._onFocus()}>
        <app.HeaderComponent title={app.language.app} showDisconnect={true}
          additionalMenu={<area.MenuComponent vm={this.state.vm} />}
          onSearch={(value) => this._onSearch(value)}>
          <app.FooterComponent>
            <area.MainView vm={this.state.vm} />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.FocusComponent>
    );
  }

  private _onFocus() {
    if (app.dialogManager.dialogs.length) return;
    if (app.settings.autoRefresh) this.state.vm.refreshAsync();
  }

  private _onSearch(value: string) {
    this.state.vm.changeSearchTitle(value);
    this.state.vm.refreshAsync();
  }
}
