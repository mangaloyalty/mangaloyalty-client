import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainController extends React.Component<{vm: app.MainViewModel}> {
  static createConstruct(search?: string) {
    return async (restoreState?: app.MainRestoreState) => {
      const vm = new app.MainViewModel(search, restoreState);
      await vm.refreshAsync();
      return <MainController vm={vm} />;
    };
  }

  render() {
    return (
      <app.HeaderComponent defaultSearch={this.props.vm.search} title={language.remote}
        icon={<app.MainIconComponent vm={this.props.vm} />}
        onSearch={(value) => this.props.vm.changeSearchAsync(value)}>
        <app.MainView vm={this.props.vm} />
      </app.HeaderComponent>
    );
  }
}
