import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class DialogManagerView extends React.Component {
  render() {
    return app.core.dialog.items.map((item, index) => (
      <mui.Dialog key={item.id} fullWidth maxWidth={false} open={index === app.core.dialog.items.length - 1} style={app.limiter}>
        <mui.DialogContent>
          <mui.DialogContentText>
            {item.body}
          </mui.DialogContentText>
          {item.error && <pre style={styles.error}>
            {item.error}
          </pre>}
        </mui.DialogContent>
        <mui.DialogActions>
          {item.buttons.map((button, index) => (
            <mui.Button key={index} color={index === item.buttons.length - 1 ? 'primary' : 'default'} onClick={() => item.send(index)}>
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
