import * as app from '.';
import * as areas from '..';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export function boot(container: HTMLElement | null) {
  areas.shared.connectStyles(areas);
  areas.shared.core.screen.openAsync(areas.connect.MainController.createConstruct());
  ReactDOM.render(<app.MainView />, container);
}
