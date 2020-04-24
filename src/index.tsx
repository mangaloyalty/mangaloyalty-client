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
  areas.shared.connectStyles(areas);
  areas.shared.api.socket.attach();
  areas.shared.core.screen.openAsync(areas.library.MainController.createConstruct());
  ReactDOM.render(<App />, document.getElementById('container'));
})();
