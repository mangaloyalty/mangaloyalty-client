import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class MainIconComponent extends React.Component<{vm: app.MainViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <app.MenuComponent title={language.sessionIconMenu}>
          <mui.MenuItem onClick={() => this.props.vm.refreshAsync()}>
            <mui.ListItemIcon>
              <app.icons.Refresh />
            </mui.ListItemIcon>
            <mui.ListItemText primary={language.sessionIconRefresh} />
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
