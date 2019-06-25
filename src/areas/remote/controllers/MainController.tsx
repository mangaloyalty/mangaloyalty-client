import * as app from '../../..';
import * as area from '..';
import * as React from 'react';

export class MainController extends React.Component {
  state = {
    vm: new area.MainViewModel()
  };

  render() {
    return (
      <app.FocusComponent onFocus={this._onFocus.bind(this)}>
        <app.HeaderComponent additionalMenu={<area.MenuComponent vm={this.state.vm} />} title={app.language.title} showDisconnect={true} onSearch={this._onSearch.bind(this)}>
          <app.FooterComponent>
            <area.MainView vm={this.state.vm} />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.FocusComponent>
    );
  }

  private _onFocus() {
    this.state.vm.refreshAsync();
  }

  private _onSearch(value: string) {
    this.state.vm.changeSearch(value);
  }
}
