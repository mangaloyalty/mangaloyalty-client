import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{vm: app.SeriesViewModel}> {
  static createConstruct(url: string) {
    return async (restoreState?: app.SeriesRestoreState) => {
      const vm = new app.SeriesViewModel(url, restoreState);
      await vm.refreshAsync();
      return <SeriesController vm={vm} />;
    };
  }

  render() {
    return (
      <app.HeaderTitleComponent title={this.props.vm.title}
        icon={<app.SeriesIconComponent vm={this.props.vm} />}
        onBack={() => app.core.screen.leaveAsync()}>
        <app.SeriesView vm={this.props.vm} />
      </app.HeaderTitleComponent>
    );
  }
}
