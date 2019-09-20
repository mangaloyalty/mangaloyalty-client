import * as mui from '@material-ui/core';
import * as React from 'react';

export class RepeatComponent extends React.Component<{timeout: number, onRepeatAsync: () => Promise<void>}> {
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
      await this.props.onRepeatAsync();
      this._scheduleTick();
    }, this.props.timeout);
  }
}
