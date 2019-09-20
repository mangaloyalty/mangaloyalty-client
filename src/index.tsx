// TODO: Dialog error -> close is incorrect with the new preload-then-show order. Rethink.
// UX: Generic: Use `tslib` helper for better built package sizes.
// UX: Generic: Production-ready lazy loading library for performance-heavy lists (library/chapters). Optimize tooltips?
// UX: Generic: EmptyComponent does not respect parent claimed tab space.
// UX: Reader: Option to disable image processing (e.g. old series are parsed too aggressively).
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
      <muiStyles.ThemeProvider theme={areas.shared.theme}>
        <mui.CssBaseline />
        <areas.shared.DialogManagerView />
        <areas.shared.ScreenManagerView />
        <areas.shared.ToastManagerView />
      </muiStyles.ThemeProvider>
    );
  }
}

async function RootAsync(rootType: areas.shared.RootType) {
  switch (rootType) {
    case areas.shared.RootType.Connect:
      return await areas.shared.core.screen.openAsync(areas.connect.MainController.constructAsync);
    case areas.shared.RootType.Library:
      return await areas.shared.core.screen.openAsync(areas.library.MainController.constructAsync);
    case areas.shared.RootType.Remote:
      return await areas.shared.core.screen.openAsync(areas.remote.MainController.constructAsync);
    case areas.shared.RootType.Session:
      return await areas.shared.core.screen.openAsync(areas.session.MainController.constructAsync);
  }
}

(function() {
  mobx.reaction(() => areas.shared.core.route.rootType, RootAsync, {fireImmediately: true});
  ReactDOM.render(<App />, document.getElementById('container'));
})();
