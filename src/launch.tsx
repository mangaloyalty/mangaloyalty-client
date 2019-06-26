import * as app from '.';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// TODO: screen manager bindings, and on startup we just add a router as base screen.

@mobxReact.observer
class App extends React.Component {
  render() {
    return (
      <mui.MuiThemeProvider theme={app.theme}>
        <mui.CssBaseline />
        <app.DialogManagerView />
        <app.RouteManagerView />
      </mui.MuiThemeProvider>
    );
  }
}

(function() {
  // TODO: Temp.
  app.serviceManager.set('ContextApi', new app.ContextApi(location.protocol + '//' + location.hostname + ':7783'));
  app.routeManager.changeView(app.ViewType.Remote);

  mobx.configure({enforceActions: 'observed'});
  ReactDOM.render(<App />, document.getElementById('container'));
})();
