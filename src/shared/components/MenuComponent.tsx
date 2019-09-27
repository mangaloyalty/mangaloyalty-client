import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class MenuComponent extends React.Component<{title: string}> {
  state = {
    anchorEl: undefined,
  };

  render() {
    return (
      <mui.Grid style={styles.container}>
        <mui.Tooltip title={this.props.title}>
          <mui.IconButton color="inherit" onClick={(ev) => this.setState({anchorEl: ev.currentTarget})}>
            <app.icons.MoreVert />
          </mui.IconButton>
        </mui.Tooltip>
        <mui.Popper anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} disablePortal placement="left-start" transition>
          {({TransitionProps}) => (
           <mui.Grow {...TransitionProps} style={styles.grow}>
              <mui.Paper>
                <mui.ClickAwayListener onClickAway={() => this.setState({anchorEl: undefined})}>
                  <mui.MenuList onClick={() => this.setState({anchorEl: undefined})}>
                    {this.props.children}
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
  container: {
    display: 'inline-block'
  },
  grow: {
    transform: 'translateX(48px)',
    transformOrigin: 'center bottom'
  }
});
