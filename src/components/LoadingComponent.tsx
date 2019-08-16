import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class LoadingComponent extends React.Component<{open: boolean}> {
  render() {
    return (
      <mui.Modal open={this.props.open}>
        <mui.Grid style={styles.container}>
          <mui.CircularProgress style={styles.icon} />
        </mui.Grid>
      </mui.Modal>
    );
  }
}

const styles = app.styles({
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    outline: 0,
    position: 'fixed',
    top: 0
  },
  icon: {
    animation: 'none',
    left: '50%',
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
});
