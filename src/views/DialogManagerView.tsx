import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class DialogManagerView extends React.Component {
  render() {
    return app.dialogManager.items.map((item, itemIndex) => (
      <mui.Dialog key={item.id} fullWidth maxWidth={false} open={itemIndex === app.dialogManager.items.length - 1}>
        <mui.DialogContent>
          <mui.DialogContentText>
            {item.body}
            {item.error && <pre style={styles.error}>
              {item.error}
            </pre>}
          </mui.DialogContentText>
        </mui.DialogContent>
        <mui.DialogActions>
          {item.buttons.map((button, index) => (
            <mui.Button color={index === item.buttons.length - 1 ? "primary" : "default"} onClick={() => item.send(index)}>
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
