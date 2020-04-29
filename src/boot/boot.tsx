import * as app from '.';
import * as areas from '..';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export function bootApp(container: HTMLElement | null) {
  areas.shared.connectStyles(areas);
  areas.shared.api.socket.attach();
  areas.shared.core.screen.openAsync(areas.library.MainController.createConstruct());
  ReactDOM.render(<app.MainView />, container);
}
