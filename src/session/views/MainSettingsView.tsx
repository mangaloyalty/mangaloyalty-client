import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainSettingsView extends app.BaseComponent<typeof MainSettingsViewStyles, {vm: app.MainSettingsViewModel}> {
  render() {
    return (
      <mui.Dialog className={this.classes.container} fullWidth maxWidth={false} open={this.props.vm.showDialog} transitionDuration={0}>
        <mui.DialogTitle>
          {language.sessionSettings}
        </mui.DialogTitle>
        <mui.DialogContent>
          <mui.FormGroup className={this.classes.formGroup}>
            <mui.InputLabel>
              {language.sessionSettingsMode}:
            </mui.InputLabel>
            <mui.FormControlLabel
              control={<mui.Switch checked={this.props.vm.enableModeRTL} onChange={() => this.props.vm.toggleModeRTL()} />}
              label={language.sessionSettingsModeRTL} />
          </mui.FormGroup>
          <mui.FormGroup className={this.classes.formGroup}>
            <mui.InputLabel>
              {language.sessionSettingsNavigation}:
            </mui.InputLabel>
            <mui.FormControlLabel
              control={<mui.Switch checked={this.props.vm.enableNavigationKeyboard} onChange={() => this.props.vm.toggleNavigationKeyboard()} />}
              label={language.sessionSettingsNavigationKeyboard} />
            <mui.FormControlLabel
              control={<mui.Switch checked={this.props.vm.enableNavigationSwipe} onChange={() => this.props.vm.toggleNavigationSwipe()} />}
              label={language.sessionSettingsNavigationSwipe} />
            <mui.FormControlLabel
              control={<mui.Switch checked={this.props.vm.enableNavigationTap} onChange={() => this.props.vm.toggleNavigationTap()} />}
              label={language.sessionSettingsNavigationTap} />
          </mui.FormGroup>
          <mui.FormGroup className={this.classes.formGroup}>
            <mui.InputLabel>
              {language.sessionSettingsPageSize}:
            </mui.InputLabel>
            <mui.FormControl fullWidth>
              <mui.Select value={this.props.vm.pageSize}
                MenuProps={{transitionDuration: 0}}
                onChange={(ev) => this.props.vm.changePageSize(ev.target.value as any)}>
                <mui.MenuItem value={app.PageSize.None}>{language.sessionSettingsPageSizeNone}</mui.MenuItem>
                <mui.MenuItem value={app.PageSize.Paperback}>{language.sessionSettingsPageSizePaperback}</mui.MenuItem>
                <mui.MenuItem value={app.PageSize.Digest}>{language.sessionSettingsPageSizeDigest}</mui.MenuItem>
                <mui.MenuItem value={app.PageSize.Pocket}>{language.sessionSettingsPageSizePocket}</mui.MenuItem>
                <mui.MenuItem value={app.PageSize.JapaneseB6}>{language.sessionSettingsPageSizeJapaneseB6}</mui.MenuItem>
                <mui.MenuItem value={app.PageSize.ISOA5}>{language.sessionSettingsPageSizeISOA5}</mui.MenuItem>
              </mui.Select>
            </mui.FormControl>
          </mui.FormGroup>
        </mui.DialogContent>
        <mui.DialogActions>
          <mui.Button color="primary" onClick={() => this.props.vm.toggleDialog()}>
            {language.sessionSettingsAction}
          </mui.Button>
        </mui.DialogActions>
      </mui.Dialog>
    );
  }
}

export const MainSettingsViewStyles = mui.createStyles({
  container: {
    margin: '0 auto',
    maxWidth: '100%',
    width: 480
  },
  formGroup: {
    marginBottom: 16
  }
});
