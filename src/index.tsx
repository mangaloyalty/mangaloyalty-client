// TODO: Normalize the icon usage and possibly get rid of the FABs.
// TODO: Check the padding usage (margins are fine).
// UX: Generic: Production-ready lazy loading library for performance-heavy lists (library/chapters). Optimize tooltips?
// UX: Generic: EmptyComponent does not respect parent claimed tab space.
// UX: Generic: PWA on iOS should be fullscreen like Android (no status bar), iPhone X should not have bottom insets.
// UX: Generic: Night-mode (black background on reader, different color scheme for UI).
// UX: Reader: Option to disable image processing (e.g. old series are parsed too aggressively).
// UX: Reader: Direction (LTR, RTL).
// UX: Reader: Mode (Page-By-Page, Webtoon/Scroll).
// UX: Reader: Quick jump to page.
// UX: Reader: Show the page number and page count (20 / 51).
// UX: Library: Provider is not visible. It should be on both list and series.
// UX: Library/Main: Automation settings for ALL series in the library.
// UX: Library/Main: Update from source for ALL series in the library.
// UX: Library/Series: UnreadCount should be shown on the image, just like in the listing.
// UX: Library/Series: Soft delete option, delete all chapters but keep the listing and progress.
// UX: Library/Series: Author(s) and Genre(s) are not on-screen. Neither is Status (Ongoing/Completed). They should be. 
// UX: Library/Series: When no chapter is available, the chapter tab should have an empty message.
// UX: Library/Series: Mark-as-read for all chapters.
// UX: Library/Series: Download all? Using automations or something different?
// UX: Remote/Main: Support infinite scroll while pages are available.
// UX: Remote/Series: Author(s) and Genre(s) are not on-screen. Neither is Status (Ongoing/Completed). They should be. 
// UX: Remote/Series: When no chapter is available, the chapter tab should have an empty message.
// UX: Remote/Series: Add when already in library should produce a warning or prevent it entirely.
// UX: Remote/Series: On add, prompt with automation dialog to configure frequency/chapters.
// UX: Screen: Back button support (via history).
// UX: Touch: Support mouse-drag and mouse-scroll (Desktop-mode).
// UX: Touch: Support swipe gestures for page navigation.
// UX: Touch: Double click/tap for quick zoom-in on designated point.
// UX: Touch: Zoom with constraints of the image instead of the container.
// UX: Touch: Zoom to the center of the pinch (ev.center?).
import * as areas from './areas';
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

(function() {
  areas.shared.api.socket.attach();
  areas.shared.core.screen.openAsync(areas.library.MainController.constructAsync);
  ReactDOM.render(<App />, document.getElementById('container'));
})();
