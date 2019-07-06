import * as app from '.';
import * as areas from './areas';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as muiStyles from '@material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// UX: Back button support for Android/Desktop (via History).
// UX: Make a PWA check for Android/iPhone/iPad with PWA instructions before loading root.
// UX: Make an appcache manifest (service-worker?). Challenge: Make development work with auto-reloads, and on-prod updates via appcache.
// UX: Reader: Direction (LTR, RTL).
// UX: Reader: Mode (Page-By-Page, Webtoon/Scroll).
// UX: Reader: Quick jump to page.

@mobxReact.observer
class App extends React.Component {
  render() {
    return (
      <muiStyles.ThemeProvider theme={app.theme}>
        <mui.CssBaseline />
        <app.DialogManagerView />
        <app.ScreenManagerView />
        <app.ToastManagerView />
      </muiStyles.ThemeProvider>
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
