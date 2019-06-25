import * as app from '..';
import * as mobx from 'mobx';

export const routeManager = {
  changeView(viewType: app.ViewType) {
    this.viewType = viewType;
  },

  viewType: app.ViewType.Library
};

mobx.decorate(routeManager, {
  changeView: mobx.action,
  viewType: mobx.observable
});
