import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ScreenManagerView extends React.Component {
  componentDidUpdate() {
    const previous = app.core.screen.items[app.core.screen.items.length - 1];
    window.scrollTo(previous.scrollX, previous.scrollY);  
  }

  render() {
    return app.core.screen.items.map((item, index) => (
      <mui.Grid key={index} style={{display: index === app.core.screen.items.length - 1 ? 'inherit' : 'none'}}>
        {item.element}
      </mui.Grid>
    ));
  }
}
