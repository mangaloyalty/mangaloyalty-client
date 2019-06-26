import * as app from '..';
import * as areas from '../areas';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class RouteManagerView extends React.Component {
  render() {
    switch (app.routeManager.viewType) {
      case app.ViewType.Library:
        return <areas.library.MainController />;
      case app.ViewType.Remote:
        return <areas.remote.MainController />;
      default:
        return <areas.connect.MainController />;
    }
  }
}
