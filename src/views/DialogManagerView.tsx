import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class DialogManagerView extends React.Component {
  render() {
    return app.dialogManager.dialogs.map((dialog, index) => (
      <mui.Dialog key={dialog.id} fullWidth maxWidth={false} open={index === app.dialogManager.dialogs.length - 1}>
        <mui.DialogContent>
          <mui.DialogContentText>
            {dialog.body}
          </mui.DialogContentText>
          {dialog.error && <pre style={styles.error}>
            {dialog.error}
          </pre>}
        </mui.DialogContent>
        <mui.DialogActions>
          {dialog.buttons.map((button, index) => (
            <mui.Button key={index} color={index === dialog.buttons.length - 1 ? 'primary' : 'default'} onClick={() => dialog.send(index)}>
              {button}
            </mui.Button>
          ))}
        </mui.DialogActions>
      </mui.Dialog>
    ));
  }
}

const styles = app.styles({
  error: {
    height: 128,
    overflow: 'scroll'
  }
});
