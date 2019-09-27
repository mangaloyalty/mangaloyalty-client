import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{vm: app.SeriesViewModel}> {
  static createConstruct(url: string) {
    return async (restoreState?: app.SeriesRestoreState) => {
      const context = app.core.service.get<app.ContextApi>(app.settings.contextKey);
      const vm = new app.SeriesViewModel(context, url, restoreState);
      await vm.refreshAsync();
      return <SeriesController vm={vm} />;
    };
  }

  render() {
    return (
      <app.FocusComponent onFocus={() => this.props.vm.refreshAsync()}>
        <app.HeaderComponent title={this.props.vm.title}
          icon={<app.SeriesIconComponent vm={this.props.vm} />}
          onBack={() => app.core.screen.leaveAsync()}>
          <app.SeriesView vm={this.props.vm} />
        </app.HeaderComponent>
      </app.FocusComponent>
    );
  }
}
