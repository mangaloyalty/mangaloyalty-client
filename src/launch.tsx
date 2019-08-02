// UX: Generic: EmptyComponent does not respect parent claimed tab space.
// UX: Reader: Direction (LTR, RTL).
// UX: Reader: Mode (Page-By-Page, Webtoon/Scroll).
// UX: Reader: Quick jump to page.
// UX: Reader: Show the page number and page count (20 / 51).
// UX: Remote/Main: Support infinite scroll while pages are available.
// UX: Screen: Back button support (via history).
// UX: Series: Author(s) and Genre(s) are not on-screen. Neither is Status (Ongoing/Completed). They should be. 
// UX: Series: When no chapter is available, the chapter tab should have an empty message.
// UX: Touch: Support mouse-drag and mouse-scroll (Desktop-mode).
// UX: Touch: Support swipe gestures for page navigation.
// UX: Touch: Double click/tap for quick zoom-in on designated point.
// UX: Touch: Zoom with constraints of the image instead of the container.
// UX: Touch: Zoom to the center of the pinch (ev.center?).
import * as app from '.';
import * as areas from './areas';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as muiStyles from '@material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

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
