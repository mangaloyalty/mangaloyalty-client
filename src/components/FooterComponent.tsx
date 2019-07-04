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
          <mui.BottomNavigation showLabels value={app.core.screen.rootType - 1}>
            <mui.BottomNavigationAction
              icon={<app.icons.Home />}
              label={app.language.menuBottomLibrary}
              onClick={() => app.core.screen.changeRoot(app.RootType.Library)} />
            <mui.BottomNavigationAction
              icon={<app.icons.Public />}
              label={app.language.menuBottomRemote}
              onClick={() => app.core.screen.changeRoot(app.RootType.Remote)} />
            <mui.BottomNavigationAction
              icon={<app.icons.Portrait />}
              label={app.language.menuBottomSession}
              onClick={() => app.core.screen.changeRoot(app.RootType.Session)} />
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
    width: '100%'
  }
});
