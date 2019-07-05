import * as mui from '@material-ui/core';
import * as React from 'react';

export class ButtonComponent extends React.Component<{title: string, style?: React.CSSProperties, onClick: () => void}> {
  render() {
    return (
      <mui.Tooltip title={this.props.title}>
        <mui.IconButton color="inherit" style={this.props.style} onClick={(ev) => Boolean(this.props.onClick()) || ev.currentTarget.blur()}>
          {this.props.children}
        </mui.IconButton>
      </mui.Tooltip>
    );
  }
}