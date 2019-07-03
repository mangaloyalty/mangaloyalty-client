import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class HeaderMenuComponent extends React.Component<{menu: React.ReactElement<any>}> {
  state = {
    anchorEl: undefined,
  };

  render() {
    return (
      <mui.Grid style={styles.menu}>
        <mui.IconButton color="inherit" onClick={(ev) => this.setState({anchorEl: ev.currentTarget})}>
          <app.icons.MoreVert />
        </mui.IconButton>
        <mui.Popper anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} disablePortal transition>
          {({TransitionProps}) => (
           <mui.Grow {...TransitionProps} style={styles.popper}>
              <mui.Paper>
                <mui.ClickAwayListener onClickAway={() => this.setState({anchorEl: undefined})}>
                  <mui.MenuList onClick={() => this.setState({anchorEl: undefined})}>
                    {this.props.menu}
                  </mui.MenuList>
                </mui.ClickAwayListener>
              </mui.Paper>
           </mui.Grow>
          )}
        </mui.Popper>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  menu: {
    display: 'inline-block'
  },
  popper: {
    transformOrigin: 'center bottom',
    transform: 'translateY(-48px)'
  }
});
