import * as app from '..';
import * as areas from '../..';
import * as mobx from 'mobx';
let checkAutomatic = true;

export class MainViewModel {
  constructor() {
    app.core.context.socket.detach();
    this._automaticAsync();
  }

  @mobx.action
  changeServer(server: string) {
    this.server = server;
  }

  @mobx.action
  async tryConnectAsync() {
    if (this.server) {
      await this._connectAsync();
      this.isServerError = false;
    } else {
      this.isServerError = true;
    }
  }

  @mobx.observable
  isServerError = false;

  @mobx.observable
  isVisible = false;

  @mobx.observable
  server = localStorage.getItem('ConnectServer') || createServer();

  private async _automaticAsync() {
    if (checkAutomatic) {
      await this._connectAsync();
      checkAutomatic = false;
      this.isVisible = true;
    } else {
      this.isVisible = true;
    }
  }

  private async _connectAsync() {
    await app.core.screen.loadAsync(async () => {
      const context = new app.ConnectContext(normalizeServer(this.server));
      const sessionList = await context.session.listAsync();
      if (sessionList.value) {
        app.core.context = context;
        app.core.context.socket.attach();
        await areas.shared.core.screen.openChildAsync(areas.library.MainController.createConstruct());
        localStorage.setItem('ConnectServer', this.server);
      } else {
        await app.core.dialog.errorAsync(() => Promise.resolve(), sessionList.error);
        localStorage.removeItem('ConnectServer');
      }
    });
  }
}

function createServer() {
  if (!window.hasOwnProperty('oni')) {
    return !/^7767|7783$/.test(location.port) ? location.host : location.hostname;
  } else if (!/iPad|iPhone/.test(navigator.userAgent)) {
    return 'localhost';
  } else {
    return '';
  }
}

function normalizeServer(server: string) {
  if (!/^https?:\/\//i.test(server)) server = `http://${server}`;
  if (!/^https?:\/\/.*:/i.test(server)) server = `${server}:7783`;
  return server.replace(/^(https?:\/\/.+?)\/.*/, '$1');
}
