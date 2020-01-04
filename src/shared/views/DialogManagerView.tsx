import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class DialogManagerView extends app.BaseComponent<typeof DialogManagerViewStyles> {
  render() {
    return app.core.dialog.items.map((item, index) => (
      <mui.Dialog className={this.classes.container} key={item.id} fullWidth maxWidth={false} open={index === app.core.dialog.items.length - 1} transitionDuration={0}>
        <mui.DialogContent className={this.classes.content}>
          <mui.DialogContentText>
            {item.body}
          </mui.DialogContentText>
          {Boolean(item.errorTexts.length) && <pre className={this.classes.error}>
            {item.errorTexts.map((errorText) => <text>{errorText}</text>)}
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

export const DialogManagerViewStyles = mui.createStyles({
  container: app.withLimiter({
  }),
  content: {
    paddingTop: 24
  },
  error: {
    height: 128,
    overflow: 'scroll'
  }
});
