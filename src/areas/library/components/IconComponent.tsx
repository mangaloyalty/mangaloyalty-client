import * as app from '../../..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class IconComponent extends React.Component<{onRead?: () => void, onRefresh: () => void}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        {this.props.onRead && <app.ButtonComponent title={app.language.libraryIconRead} onClick={() => this.props.onRead!()}>
          <app.icons.PlayCircleOutline />
        </app.ButtonComponent>}
        <app.MenuComponent title={app.language.libraryIconMenu}>
          <mui.MenuItem onClick={() => this.props.onRefresh()}>
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
