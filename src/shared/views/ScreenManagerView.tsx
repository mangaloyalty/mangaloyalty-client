import * as app from '..';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ScreenManagerView extends React.Component {
  private _scrollTo?: {x: number, y: number};

  componentDidMount() {
    mobx.reaction(() => app.core.screen.presentView, (presentView) => {
      this._scrollTo = presentView && typeof presentView.x === 'number' && typeof presentView.y === 'number'
        ? {x: presentView.x, y: presentView.y}
        : {x: 0, y: 0};
    });
  }

  componentDidUpdate() {
    if (!this._scrollTo) return;
    scrollTo(this._scrollTo.x, this._scrollTo.y);
    delete this._scrollTo;
  }

  render() {
    return (
      <mui.Grid>
        <app.LoadingComponent open={Boolean(app.core.screen.loadCount)} />
        {app.core.screen.presentView && app.core.screen.presentView.element}
      </mui.Grid>
    );
  }
}
