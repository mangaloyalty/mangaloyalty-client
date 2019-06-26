import * as app from '..';
import * as mobx from 'mobx';
import * as React from 'react';

export const screenManager = {
  changeRoot(rootType: app.RootType) {
    this.rootType = rootType;
  },
  
  push(element: React.ReactElement<any>) {
    const previous = screenManager.screens.length && screenManager.screens[screenManager.screens.length - 1];
    if (previous) previous.scrollX = window.scrollX;
    if (previous) previous.scrollY = window.scrollY;
    screenManager.screens.push({element, scrollX: 0, scrollY: 0});
  },

  pop() {
    screenManager.screens.pop();
  },

  rootType: app.RootType.Connect,

  screens: [] as {
    element: React.ReactElement<any>,
    scrollX: number,
    scrollY: number
  }[]
};

mobx.decorate(screenManager, {
  changeRoot: mobx.action,
  push: mobx.action,
  pop: mobx.action,
  rootType: mobx.observable,
  screens: mobx.observable
});
