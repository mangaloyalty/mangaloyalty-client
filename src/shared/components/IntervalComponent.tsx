import * as mui from '@material-ui/core';
import * as React from 'react';

export class IntervalComponent extends React.Component<{timeout: number, onIntervalAsync: () => Promise<void>}> {
  private _timeoutHandle?: NodeJS.Timer;

  componentDidMount() {
    this._scheduleTick();
  }

  componentWillUnmount() {
    if (!this._timeoutHandle) return;
    clearTimeout(this._timeoutHandle);
  }

  render() {
    return (
      <mui.Grid>
        {this.props.children}
      </mui.Grid>
    );
  }

  private _scheduleTick() {
    this._timeoutHandle = setTimeout(async () => {
      await this.props.onIntervalAsync();
      this._scheduleTick();
    }, this.props.timeout);
  }
}
