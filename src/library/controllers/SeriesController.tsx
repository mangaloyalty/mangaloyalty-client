import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

// TODO: State pinning for history.back and tab selection.
@mobxReact.observer
export class SeriesController extends React.Component<{vm: app.SeriesViewModel}> {
  static createConstruct(id: string) {
    return async () => {
      const vm = new app.SeriesViewModel(id);
      await vm.refreshAsync();
      return <SeriesController vm={vm} />;
    };
  }

  render() {
    return (
      <app.RefreshComponent onRefresh={() => this.props.vm.refreshAsync()}>
        <app.RepeatComponent timeout={app.settings.librarySeriesRepeatTimeout} onRepeatAsync={() => this.props.vm.repeatAsync()} />
        <app.HeaderComponent title={this.props.vm.title}
          icon={<app.SeriesIconComponent vm={this.props.vm} />}
          onBack={() => app.core.screen.leaveAsync()}>
          <app.SeriesView vm={this.props.vm} />
        </app.HeaderComponent>
      </app.RefreshComponent>
    );
  }
}
