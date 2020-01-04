import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class ButtonComponent extends app.BaseComponent<typeof ButtonComponentStyles, {className?: string, color?: mui.PropTypes.Color, title: string, disabled?: boolean, onClick: () => void}> {
  render() {
    return (
      <mui.Tooltip title={this.props.title}>
        <mui.Grid className={this.classes.container}>
          <mui.IconButton className={this.props.className} color={this.props.color}
            disabled={this.props.disabled}
            onClick={() => this.props.onClick()}>
            {this.props.children}
          </mui.IconButton>
        </mui.Grid>
      </mui.Tooltip>
    );
  }
}

export const ButtonComponentStyles = mui.createStyles({
  container: {
    display: 'inline-block'
  }
});
