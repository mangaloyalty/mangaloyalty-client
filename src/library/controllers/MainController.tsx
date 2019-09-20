import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import {language} from '../language';

// TODO: Scroll to top when changing filters/search (NOT during refresh).
// TODO: State pinning for history.back and search.
@mobxReact.observer
export class MainController extends React.Component<{vm: app.MainViewModel}> {
  static async constructAsync() {
    const vm = new app.MainViewModel();
    await vm.refreshAsync();
    return <MainController vm={vm} />;
  }

  render() {
    return (
      <app.RefreshComponent onRefresh={() => this.props.vm.refreshAsync()}>
        <app.HeaderComponent title={language.library}
          icon={<app.MainIconComponent vm={this.props.vm} />}
          onBack={() => app.core.dialog.disconnectAsync()}
          onSearch={(value) => this.props.vm.changeSearchAsync(value)}>
          <app.FooterComponent>
            <app.MainView vm={this.props.vm} />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.RefreshComponent>
    );
  }
}
