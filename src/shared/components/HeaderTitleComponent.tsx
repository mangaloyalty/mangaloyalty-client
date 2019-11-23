import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class HeaderTitleComponent extends React.Component<{icon?: React.ReactElement<any>, title: string, onBack: () => void}> {
  render() {
    return (
      <mui.Grid>
        <mui.AppBar className="disablePadding">
          <mui.Grid className="inset-top">
            <mui.Toolbar style={app.limiter}>
              <app.ButtonComponent color="inherit" title={language.iconBack} style={styles.back} onClick={() => this.props.onBack()}>
                <app.icons.ArrowBackIos />
              </app.ButtonComponent>
              <mui.Typography color="inherit" variant="h6" style={styles.title}>
                {this.props.title}
              </mui.Typography>
              <mui.Grid style={styles.menu}>
                {this.props.icon}
              </mui.Grid>
            </mui.Toolbar>
          </mui.Grid>
        </mui.AppBar>
        <mui.Grid className="inset-top">
          <mui.Grid style={{...styles.children, ...app.limiter}}>
            {this.props.children}
          </mui.Grid>
        </mui.Grid>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  children: {
    paddingTop: 64
  },
  back: {
    marginLeft: -24,
    paddingLeft: 16,
    paddingRight: 6
  },
  title: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  menu: {
    marginRight: -20
  }
});
