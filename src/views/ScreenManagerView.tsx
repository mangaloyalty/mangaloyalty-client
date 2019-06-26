import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ScreenManagerView extends React.Component {
  componentDidUpdate() {
    const previous = app.screenManager.screens[app.screenManager.screens.length - 1];
    window.scrollTo(previous.scrollX, previous.scrollY);  
  }

  render() {
    return app.screenManager.screens.map((screen, index) => (
      <mui.Grid key={index} style={{display: index === app.screenManager.screens.length - 1 ? 'inherit' : 'none'}}>
        {screen.element}
      </mui.Grid>
    ));
  }
}
