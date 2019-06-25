import * as app from '.';
import * as areas from './areas';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

@mobxReact.observer
class App extends React.Component {
  render() {
    return (
      <mui.MuiThemeProvider theme={app.theme}>
        <mui.CssBaseline />
        <DialogManager />
        <RouteManager />
      </mui.MuiThemeProvider>
    );
  }
}

@mobxReact.observer
class DialogManager extends React.Component {
  render() {
    return app.dialogManager.items.map((item, itemIndex) => (
      <mui.Dialog key={item.id} fullWidth maxWidth={false} open={itemIndex === app.dialogManager.items.length - 1}>
        <mui.DialogContent>
          <mui.DialogContentText>
            {item.body}
          </mui.DialogContentText>
        </mui.DialogContent>
        <mui.DialogActions>
          {item.buttons.map((button, index) => (
            <mui.Button color={index === item.buttons.length - 1 ? "primary" : undefined} onClick={() => item.send(index)}>
              {button}
            </mui.Button>
          ))}
        </mui.DialogActions>
      </mui.Dialog>
    ));
  }
}

// TODO: screen manager bindings, and on startup we just add a router as base screen.

@mobxReact.observer
class RouteManager extends React.Component {
  render() {
    switch (app.routeManager.viewType) {
      case app.ViewType.Library:
        return <areas.library.MainController />;
      case app.ViewType.Remote:
        return <areas.remote.MainController />;
      default:
        return <areas.connect.MainController />;
    }
  }
}

(function() {
  // TODO: Temp.
  app.serviceManager.set('ContextApi', new app.ContextApi(location.protocol + '//' + location.hostname + ':7783'));
  app.routeManager.changeView(app.ViewType.Remote);

  mobx.configure({enforceActions: 'observed'});
  ReactDOM.render(<App />, document.getElementById('container'));
})();
