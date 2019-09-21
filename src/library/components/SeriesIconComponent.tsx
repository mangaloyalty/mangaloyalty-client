import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class SeriesIconComponent extends React.Component<{vm: app.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <app.ButtonComponent title={language.libraryIconRead} onClick={() => this.props.vm.readAsync()}>
          <app.icons.PlayCircleOutline />
        </app.ButtonComponent>
        <app.MenuComponent title={language.libraryIconMenu}>
          <mui.MenuItem onClick={() => this.props.vm.refreshAsync()}>
            <mui.ListItemIcon>
              <app.icons.Refresh />
            </mui.ListItemIcon>
            <mui.ListItemText primary={language.libraryIconMenuRefresh} />
          </mui.MenuItem>
          <mui.Divider />
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
        </app.MenuComponent>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    display: 'inline-block'
  }
});
