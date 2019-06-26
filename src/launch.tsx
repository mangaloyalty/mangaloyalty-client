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
        <app.DialogManagerView />
        <app.ScreenManagerView />
      </mui.MuiThemeProvider>
    );
  }
}

@mobxReact.observer
class Root extends React.Component {
  render() {
    switch (app.screenManager.rootType) {
      case app.RootType.Library:
        return <areas.library.MainController />;
      case app.RootType.Remote:
        return <areas.remote.MainController />;
      default:
        return <areas.connect.MainController />;
    }
  }
}

(function() {
  // TODO: Temp.
  app.serviceManager.set('ContextApi', new app.ContextApi(location.protocol + '//' + location.hostname + ':7783'));
  app.screenManager.changeRoot(app.RootType.Remote);

  app.screenManager.push(<Root />);
  mobx.configure({enforceActions: 'observed'});
  ReactDOM.render(<App />, document.getElementById('container'));
})();
