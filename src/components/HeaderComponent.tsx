import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class HeaderComponent extends React.Component<{title: string}> {
  render() {
    return (
      <mui.Grid>
        <mui.AppBar className="ios-inset-top">
          <mui.Toolbar>
            <mui.Typography color="inherit" variant="h6" style={styles.title}>
              {this.props.title}
            </mui.Typography>
          </mui.Toolbar>
        </mui.AppBar>
        <mui.Grid className="ios-inset-top ios-inset-bottom">
          <mui.Grid style={styles.childrenContainer}>
            {this.props.children}
          </mui.Grid>
        </mui.Grid>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  title: {
    flex: 1
  },
  childrenContainer: {
    paddingTop: 64
  }
});
