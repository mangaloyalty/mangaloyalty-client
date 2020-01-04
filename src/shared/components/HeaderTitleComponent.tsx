import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class HeaderTitleComponent extends app.BaseComponent<typeof HeaderTitleComponentStyles, {icon?: React.ReactElement<any>, title: string, onBack: () => void}> {
  render() {
    return (
      <mui.Grid>
        <mui.AppBar className="disablePadding">
          <mui.Grid className="inset-top">
            <mui.Toolbar className={this.classes.toolBar}>
              <app.ButtonComponent className={this.classes.back} color="inherit" title={language.iconBack} onClick={() => this.props.onBack()}>
                <app.icons.ArrowBackIos />
              </app.ButtonComponent>
              <mui.Typography className={this.classes.title} color="inherit" variant="h6">
                {this.props.title}
              </mui.Typography>
              <mui.Grid className={this.classes.menu}>
                {this.props.icon}
              </mui.Grid>
            </mui.Toolbar>
          </mui.Grid>
        </mui.AppBar>
        <mui.Grid className="inset-top">
          <mui.Grid className={this.classes.children}>
            {this.props.children}
          </mui.Grid>
        </mui.Grid>
      </mui.Grid>
    );
  }
}

export const HeaderTitleComponentStyles = mui.createStyles({
  children: app.withLimiter({
    paddingTop: 64
  }),
  toolBar: app.withLimiter({
  }),
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
