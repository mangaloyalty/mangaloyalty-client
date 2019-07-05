import * as app from '../../..';
import * as React from 'react';

export class RefreshIconComponent extends React.Component<{onRefresh: () => void}> {
  render() {
    return (
      <app.ButtonComponent title={app.language.remoteIconRefresh} onClick={() => this.props.onRefresh()}>
        <app.icons.Refresh />
      </app.ButtonComponent>
    );
  }
}
