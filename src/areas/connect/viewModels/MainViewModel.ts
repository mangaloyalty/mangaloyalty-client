import * as app from '../../..';
import * as mobx from 'mobx';
const serverKey = 'Server';

export class MainViewModel {
  constructor() {
    if (!app.core.storage.get(serverKey)) return;
    this.isVisible = false;
    this.connectAsync().then(() => mobx.runInAction(() => this.isVisible = true));
  }

  @mobx.action
  changeServer(server: string) {
    this.server = server;
  }

  @mobx.action
  async connectAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    this.hasServerError = false;
    const context = new app.ContextApi(this.server);
    const openapi = await context.connectAsync();
    if (openapi.result && checkVersion(openapi.result)) {
      app.core.storage.set(serverKey, this.server);
      app.core.service.set(app.settings.contextKey, context);
      app.core.screen.changeRoot(app.RootType.Remote);
    } else if (openapi.result) {
      await app.core.dialog.connectAsync();
      mobx.runInAction(() => this.isLoading = false);
    } else if (await app.core.dialog.errorAsync(openapi.error)) {
      await this.connectAsync(true);
    } else {
      mobx.runInAction(() => this.isLoading = false);
    }
  }

  @mobx.action
  async tryConnectAsync() {
    if (!this.server) {
      this.hasServerError = true;
    } else {
      await this.connectAsync();
    }
  }

  @mobx.observable
  hasServerError = false;

  @mobx.observable
  isLoading = false;

  @mobx.observable
  isVisible = true;

  @mobx.observable
  server = app.core.storage.get(serverKey) || location.hostname;
}

function checkVersion(openapi: app.IOpenApi) {
  const client = parseVersion(app.core.data.version);
  const server = parseVersion(openapi.info && openapi.info.version);
  return server.major === client.major && server.minor >= client.minor;
}

function parseVersion(value?: string) {
  const match = value && value.match(/^(\d+)\.(\d+)\.(\d+)$/);
  const version = match && {major: match[1], minor: match[2], patch: match[3]};
  return version || {major: 0, minor: 0, patch: 0};
}
