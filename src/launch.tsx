import * as app from '.';
import * as areas from './areas';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// TODO: Make app available offline using a manifest.

@mobxReact.observer
class App extends React.Component {
  render() {
    return (
      <mui.MuiThemeProvider theme={app.theme}>
        <mui.CssBaseline />
        <app.DialogManagerView />
        <app.ScreenManagerView />
        <app.ToastManagerView />
      </mui.MuiThemeProvider>
    );
  }
}

@mobxReact.observer
class Root extends React.Component {
  render() {
    switch (app.core.screen.rootType) {
      case app.RootType.Library:
        return <areas.library.MainController />;
      case app.RootType.Remote:
        return <areas.remote.MainController />;
      case app.RootType.Session:
        return <areas.session.MainController />;
      default:
        return <areas.connect.MainController />;
    }
  }
}

(function() {
  app.core.screen.open(Root);
  mobx.configure({enforceActions: 'observed'});
  ReactDOM.render(<App />, document.getElementById('container'));
})();
