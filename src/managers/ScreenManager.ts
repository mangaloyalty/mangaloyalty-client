import * as app from '..';
import * as mobx from 'mobx';
import * as React from 'react';

class ScreenManager {
  @mobx.action
  changeRoot(rootType: app.RootType) {
    this.rootType = rootType;
  }
  
  @mobx.action
  close() {
    this.screens.pop();
  }

  @mobx.action
  open<P, T extends React.Component<P, React.ComponentState>, C extends React.ComponentClass<P>>(type: React.ClassType<P, T, C>, props?: React.ClassAttributes<T> & P | null) {
    const element = React.createElement(type, props);
    const previous = this.screens.length && this.screens[this.screens.length - 1];
    if (previous) previous.scrollX = window.scrollX;
    if (previous) previous.scrollY = window.scrollY;
    this.screens.push({element, scrollX: 0, scrollY: 0});
  }

  @mobx.observable
  rootType = app.RootType.Connect;

  @mobx.observable
  screens = [] as {
    element: React.ReactElement<any>,
    scrollX: number,
    scrollY: number
  }[];
}

export const screenManager = new ScreenManager();
