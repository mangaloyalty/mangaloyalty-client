import * as app from '..';
import * as areas from '../../areas';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class FooterComponent extends React.Component<{isRemote: boolean}> {
  render() {
    return (
      <mui.Grid>
        <mui.Grid style={styles.children}>
          {this.props.children}
        </mui.Grid>
        <mui.Paper style={{...styles.navigation, ...app.limiter}}>
          <mui.Divider />
          <mui.BottomNavigation showLabels value={Number(this.props.isRemote)}>
            <mui.BottomNavigationAction
              icon={<app.icons.Home />}
              label={language.navigationLibrary}
              onClick={() => app.core.screen.openAsync(areas.library.MainController.constructAsync)} />
            <mui.BottomNavigationAction
              icon={<app.icons.Public />}
              label={language.navigationRemote}
              onClick={() => app.core.screen.openAsync(areas.remote.MainController.constructAsync)} />
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
