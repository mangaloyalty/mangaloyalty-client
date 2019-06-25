import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class FooterComponent extends React.Component {
  render() {
    return (
      <mui.Grid>
        <mui.Grid style={styles.children}>
          {this.props.children}
        </mui.Grid>
        <mui.Paper style={styles.navigation}>
          <mui.Divider />
          <mui.BottomNavigation showLabels value={app.routeManager.viewType - 1}>
            <mui.BottomNavigationAction icon={<app.icons.Home />}
              label={app.language.library}
              onClick={() => app.routeManager.changeView(app.ViewType.Library)} />
            <mui.BottomNavigationAction icon={<app.icons.Public />}
              label={app.language.remote}
              onClick={() => app.routeManager.changeView(app.ViewType.Remote)} />
          </mui.BottomNavigation>
          <mui.Grid className="ios-inset-bottom">
            <mui.Divider />
          </mui.Grid>
        </mui.Paper>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  children: {
    paddingBottom: 58
  },
  navigation: {
    bottom: 0,
    position: 'fixed',
    width: '100%',
    zIndex: 1000
  }
});
