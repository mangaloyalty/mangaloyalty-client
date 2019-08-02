import * as app from '../../..';
import * as area from '..';
import * as React from 'react';

export class MainIconComponent extends React.Component<{vm: area.MainViewModel}> {
  render() {
    return (
      <app.ButtonComponent title={app.language.sessionIconRefresh} onClick={() => this.props.vm.refreshAsync()}>
        <app.icons.Refresh />
      </app.ButtonComponent>
    );
  }
}
