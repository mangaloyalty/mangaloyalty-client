import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class CenterComponent extends React.Component<{body: string, title: string}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <mui.Typography align="center" variant="h6">
          {this.props.title}
        </mui.Typography>
        <mui.Typography align="justify">
          {this.props.body}
        </mui.Typography>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 320
  }
});
