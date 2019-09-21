import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class SeriesIconComponent extends React.Component<{vm: app.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <app.ButtonComponent title={language.remoteIconRead} onClick={() => this.props.vm.readAsync()}>
          <app.icons.PlayCircleOutline />
        </app.ButtonComponent>
        <app.MenuComponent title={language.remoteIconMenu}>
          <mui.MenuItem onClick={() => this.props.vm.refreshAsync()}>
            <mui.ListItemIcon>
              <app.icons.Refresh />
            </mui.ListItemIcon>
            <mui.ListItemText primary={language.remoteIconMenuRefresh} />
          </mui.MenuItem>
          <mui.Divider />
          <mui.MenuItem onClick={() => this.props.vm.addAsync()}>
            <mui.ListItemIcon>
              <app.icons.Add />
            </mui.ListItemIcon>
            <mui.ListItemText primary={language.remoteIconMenuAdd} />
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
