import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class ButtonComponent extends React.Component<{color?: mui.PropTypes.Color, title: string, disabled?: boolean, style?: React.CSSProperties, onClick: () => void}> {
  render() {
    return (
      <mui.Tooltip title={this.props.title}>
        <mui.Grid style={styles.container}>
          <mui.IconButton color={this.props.color} style={this.props.style}
            disabled={this.props.disabled}
            onClick={() => this.props.onClick()}>
            {this.props.children}
          </mui.IconButton>
        </mui.Grid>
      </mui.Tooltip>
    );
  }
}

const styles = app.styles({
  container: {
    display: 'inline-block'
  }
});
