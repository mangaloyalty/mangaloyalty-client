import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class ActionComponent extends React.Component<{queue: app.ActionQueue, onActionAsync: (actionList: app.IClientActionList) => Promise<void>}> {
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
  
  private async _runAsync(actionList: app.IClientActionList) {
    try {
      await this.props.onActionAsync(actionList);
    } catch (error) {
      await app.core.dialog.errorAsync(() => this._runAsync(actionList), error);
    }
  }
}
