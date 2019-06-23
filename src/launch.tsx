import * as app from '.';
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
        <Builder />
      </mui.MuiThemeProvider>
    );
  }
}

@mobxReact.observer
class Builder extends React.Component {
  render() {
    return (
      <app.HeaderComponent title={document.title}>
        <app.CounterView vm={new app.CounterViewModel()} />
      </app.HeaderComponent>
    );
  }
}

(function() {
  mobx.configure({enforceActions: 'observed'});
  ReactDOM.render(<App />, document.getElementById('container'));
})();
