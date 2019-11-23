import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ToastManagerView extends React.Component {
  render() {
    return (
      <mui.Grid style={styles.container}>
        {app.core.toast.items.map((item, index) => (
          <mui.Typography key={index} variant="body1" style={styles.typography}>
            {item}
          </mui.Typography>
        ))}
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    bottom: 0,
    left: 0,
    margin: 8,
    pointerEvents: 'none',
    position: 'fixed',
    right: 0,
    zIndex: 2100
  },
  typography: {
    background: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 8,
    color: app.theme.palette.primary.contrastText,
    marginTop: 8,
    maxWidth: 256,
    padding: 8
  }
});
