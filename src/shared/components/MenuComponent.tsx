import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class MenuComponent extends app.BaseComponent<typeof MenuComponentStyles, {title: string}> {
  state = {
    anchorEl: undefined,
  };

  render() {
    return (
      <mui.Grid className={this.classes.container}>
        <mui.Tooltip title={this.props.title}>
          <mui.IconButton color="inherit" onClick={(ev) => this.setState({anchorEl: ev.currentTarget})}>
            <app.icons.MoreVert />
          </mui.IconButton>
        </mui.Tooltip>
        <mui.Popper anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} disablePortal placement="left-start">
          <mui.Paper className={this.classes.menu} square={true}>
            <mui.ClickAwayListener onClickAway={() => this.setState({anchorEl: undefined})}>
              <mui.MenuList onClick={() => this.setState({anchorEl: undefined})}>
                {this.props.children}
              </mui.MenuList>
            </mui.ClickAwayListener>
          </mui.Paper>
        </mui.Popper>
      </mui.Grid>
    );
  }
}

export const MenuComponentStyles = mui.createStyles({
  container: {
    display: 'inline-block'
  },
  menu: {
    transform: 'translateX(48px)',
    transformOrigin: 'center bottom'
  }
});
