import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class LoadingComponent extends React.Component<{open: boolean}> {
  render() {
    return (
      <mui.Modal open={this.props.open}>
        <mui.Grid style={styles.progress}>
          <mui.CircularProgress />
        </mui.Grid>
      </mui.Modal>
    );
  }
}

const styles = app.styles({
  progress: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    outline: 0
  }
});
