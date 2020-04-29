import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class ActionComponent extends React.Component<{queue: app.ISocketQueue, onActionAsync: (actions: app.ISocketAction[]) => Promise<void>}> {
  componentDidMount() {
    this.props.queue.attach();
    this.props.queue.mount((actions) => this._runAsync(actions));
  }

  componentWillUnmount() {
    this.props.queue.detach();
  }

  render() {
    return (
      <mui.Grid>
        {this.props.children}
      </mui.Grid>
    );
  }
  
  private async _runAsync(actions: app.ISocketAction[]) {
    try {
      await this.props.onActionAsync(actions);
    } catch (error) {
      await app.core.dialog.errorAsync(() => this._runAsync(actions), error);
    }
  }
}
