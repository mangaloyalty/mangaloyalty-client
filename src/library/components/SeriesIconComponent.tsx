import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class SeriesIconComponent extends React.Component<{vm: app.SeriesViewModel}> {
  render() {
    return (
      <app.MenuComponent title={language.libraryIconMenu}>
        <mui.MenuItem onClick={() => this.props.vm.automation.toggleDialog()}>
          <mui.ListItemIcon>
            <app.icons.Settings />
          </mui.ListItemIcon>
          <mui.ListItemText primary={language.libraryIconMenuAutomation} />
        </mui.MenuItem>
        <mui.MenuItem onClick={() => this.props.vm.deleteAsync()}>
          <mui.ListItemIcon>
            <app.icons.DeleteForever />
          </mui.ListItemIcon>
          <mui.ListItemText primary={language.libraryIconMenuDelete} />
        </mui.MenuItem>
        <mui.MenuItem onClick={() => this.props.vm.updateAsync()}>
          <mui.ListItemIcon>
            <app.icons.Sync />
          </mui.ListItemIcon>
          <mui.ListItemText primary={language.libraryIconMenuUpdate} />
        </mui.MenuItem>
        <mui.Divider />
        <mui.MenuItem onClick={() => this.props.vm.dumpAsync()}>
          <mui.ListItemIcon>
            <app.icons.GetApp />
          </mui.ListItemIcon>
          <mui.ListItemText primary={language.libraryIconMenuDump} />
        </mui.MenuItem>
      </app.MenuComponent>
    );
  }
}
