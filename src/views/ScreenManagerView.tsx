import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
const core = app.core;

@mobxReact.observer
export class ScreenManagerView extends React.Component {
  componentDidUpdate() {
    const previous = core.screen.items[core.screen.items.length - 1];
    window.scrollTo(previous.scrollX, previous.scrollY);  
  }

  render() {
    return core.screen.items.map((item, index) => (
      <mui.Grid key={index} style={{display: index === core.screen.items.length - 1 ? 'inherit' : 'none'}}>
        {item.element}
      </mui.Grid>
    ));
  }
}
