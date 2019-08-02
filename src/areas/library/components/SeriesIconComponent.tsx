import * as app from '../../..';
import * as area from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SeriesIconComponent extends React.Component<{vm: area.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <app.ButtonComponent title={app.language.libraryIconRead} onClick={() => this.props.vm.readAsync()}>
          <app.icons.PlayCircleOutline />
        </app.ButtonComponent>
        <app.MenuComponent title={app.language.libraryIconMenu}>
          <mui.MenuItem onClick={() => this.props.vm.refreshAsync()}>
            <mui.ListItemIcon>
              <app.icons.Refresh />
            </mui.ListItemIcon>
            <mui.ListItemText primary={app.language.libraryIconMenuRefresh} />
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
