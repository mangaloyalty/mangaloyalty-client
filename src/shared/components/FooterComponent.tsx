import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class FooterComponent extends React.Component {
  render() {
    return (
      <mui.Grid>
        <mui.Grid style={styles.children}>
          {this.props.children}
        </mui.Grid>
        <mui.Paper style={{...styles.navigation, ...app.limiter}}>
          <mui.Divider />
          <mui.BottomNavigation showLabels value={app.core.route.rootType - 1}>
            <mui.BottomNavigationAction
              icon={<app.icons.Home />}
              label={language.navigationLibrary}
              onClick={() => app.core.route.changeRoot(app.RootType.Library)} />
            <mui.BottomNavigationAction
              icon={<app.icons.Public />}
              label={language.navigationRemote}
              onClick={() => app.core.route.changeRoot(app.RootType.Remote)} />
            <mui.BottomNavigationAction
              icon={<app.icons.Portrait />}
              label={language.navigationSession}
              onClick={() => app.core.route.changeRoot(app.RootType.Session)} />
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
    position: 'fixed'
  }
});
