import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainView extends app.BaseComponent<typeof MainViewStyles, {vm: app.MainViewModel}> {
  render() {
    return this.props.vm.isVisible && (
      <mui.Paper className={this.classes.content}>
        <mui.FormControl fullWidth>
          <mui.TextField error={this.props.vm.isServerError} fullWidth required margin="normal" variant="outlined"
            autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
            onChange={e => this.props.vm.changeServer(e.currentTarget.value)}
            onKeyDown={e => this._onKeyDown(e)}
            label={language.connectServerLabel}
            placeholder={language.connectServerPlaceholder}
            value={this.props.vm.server} />
        </mui.FormControl>
        <mui.Button fullWidth color="primary" variant="contained" onClick={() => this.props.vm.tryConnectAsync()}>
          {language.connectButton}
        </mui.Button>
      </mui.Paper>
    );
  }

  private _onKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode !== 13) return;
    this.props.vm.tryConnectAsync();
  }
}

export const MainViewStyles = mui.createStyles({
  content: {
    padding: '0 16px 16px 16px',
    width: 320,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
});
