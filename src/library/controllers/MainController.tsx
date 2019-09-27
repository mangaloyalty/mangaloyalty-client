import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainController extends React.Component<{vm: app.MainViewModel}> {
  static async constructAsync(restoreState?: app.MainRestoreState) {
    const context = app.core.service.get<app.ContextApi>(app.settings.contextKey);
    const vm = new app.MainViewModel(context, restoreState);
    await vm.refreshAsync();
    return <MainController vm={vm} />;
  }

  render() {
    return (
      <app.FocusComponent onFocus={() => this.props.vm.refreshAsync()}>
        <app.HeaderComponent defaultSearch={this.props.vm.search} title={language.library}
          icon={<app.MainIconComponent vm={this.props.vm} />}
          onBack={() => app.core.route.disconnectAsync()}
          onSearch={(value) => this.props.vm.changeSearchAsync(value)}>
          <app.FooterComponent>
            <app.MainView vm={this.props.vm} />
          </app.FooterComponent>
        </app.HeaderComponent>
      </app.FocusComponent>
    );
  }
}
