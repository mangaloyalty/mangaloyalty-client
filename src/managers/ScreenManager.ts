import * as app from '..';
import * as mobx from 'mobx';
import * as React from 'react';

export class ScreenManager {
  constructor() {
    this.items = [];
    this.rootType = 0;
  }

  @mobx.action
  changeRoot(rootType: app.RootType) {
    while (this.items.length > 1) this.items.pop();
    this.rootType = rootType;
  }
  
  @mobx.action
  close() {
    this.items.pop();
  }

  @mobx.action
  open<P, T extends React.Component<P, React.ComponentState>, C extends React.ComponentClass<P>>(type: React.ClassType<P, T, C>, props?: React.ClassAttributes<T> & P | null) {
    const element = React.createElement(type, props);
    const previous = this.items.length && this.items[this.items.length - 1];
    if (previous) previous.scrollX = window.scrollX;
    if (previous) previous.scrollY = window.scrollY;
    this.items.push({element, scrollX: 0, scrollY: 0});
  }

  @mobx.observable
  items: {
    element: React.ReactElement<any>,
    scrollX: number,
    scrollY: number
  }[];

  @mobx.observable
  rootType: app.RootType;
}
