import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class MainController extends React.Component<{vm: app.MainViewModel}> {
  static createConstruct(providerName: app.IEnumeratorProvider, search?: string) {
    return async (restoreState?: app.MainRestoreState) => {
      const vm = new app.MainViewModel(providerName, search, restoreState);
      await vm.refreshAsync();
      return <MainController vm={vm} />;
    };
  }

  render() {
    return (
      <app.HeaderMainComponent currentProvider={this.props.vm.providerName} defaultSearch={this.props.vm.search} onSearch={(value) => this.props.vm.changeSearchAsync(value)}>
        <app.MainView vm={this.props.vm} />
      </app.HeaderMainComponent>
    );
  }
}
