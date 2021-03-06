import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class SeriesAutomationView extends app.BaseComponent<typeof SeriesAutomationViewStyles, {vm: app.SeriesAutomationViewModel}> {
  render() {
    return (
      <mui.Dialog className={this.classes.container} fullWidth maxWidth={false} open={this.props.vm.showDialog} transitionDuration={0}>
        <mui.DialogTitle>
          {language.libraryAutomation}
        </mui.DialogTitle>
        <mui.DialogContent>
          <mui.FormGroup className={this.classes.formGroup}>
            <mui.InputLabel>
              {language.libraryAutomationFrequency}:
            </mui.InputLabel>
            <mui.FormControl fullWidth>
              <mui.Select value={this.props.vm.frequency}
                MenuProps={{transitionDuration: 0}}
                onChange={(ev) => this.props.vm.changeFrequency(ev.target.value as any)}>
                <mui.MenuItem value="never">{language.libraryAutomationFrequencyNever}</mui.MenuItem>
                <mui.MenuItem value="hourly">{language.libraryAutomationFrequencyHourly}</mui.MenuItem>
                <mui.MenuItem value="daily">{language.libraryAutomationFrequencyDaily}</mui.MenuItem>
                <mui.MenuItem value="weekly">{language.libraryAutomationFrequencyWeekly}</mui.MenuItem>
                <mui.MenuItem value="monthly">{language.libraryAutomationFrequencyMonthly}</mui.MenuItem>
              </mui.Select>
            </mui.FormControl>
          </mui.FormGroup>
          <mui.FormGroup className={this.classes.formGroup}>
            <mui.InputLabel>
            {language.libraryAutomationStrategy}:
            </mui.InputLabel>
            <mui.FormControl fullWidth>
              <mui.Select value={this.props.vm.strategy}
                MenuProps={{transitionDuration: 0}}
                onChange={(ev) => this.props.vm.changeStrategy(ev.target.value as any)}>
                <mui.MenuItem value="none">{language.libraryAutomationStrategyNone}</mui.MenuItem>
                <mui.MenuItem value="unread">{language.libraryAutomationStrategyUnread}</mui.MenuItem>
                <mui.MenuItem value="all">{language.libraryAutomationStrategyAll}</mui.MenuItem>
              </mui.Select>
            </mui.FormControl>
          </mui.FormGroup>
        </mui.DialogContent>
        <mui.DialogActions>
          <mui.Button onClick={() => this.props.vm.toggleDialog()}>
            {language.libraryAutomationActionCancel}
          </mui.Button>
          <mui.Button color="primary" onClick={() => this.props.vm.commitAsync()}>
            {language.libraryAutomationActionCommit}
          </mui.Button>
        </mui.DialogActions>
      </mui.Dialog>
    );
  }
}

export const SeriesAutomationViewStyles = mui.createStyles({
  container: {
    margin: '0 auto',
    maxWidth: '100%',
    width: 480
  },
  formGroup: {
    marginBottom: 16
  }
});
