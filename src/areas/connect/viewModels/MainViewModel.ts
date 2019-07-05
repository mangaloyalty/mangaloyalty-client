import * as app from '../../..';
import * as mobx from 'mobx';
const serverKey = 'Server';

export class MainViewModel {
  constructor() {
    if (!this.server) return;
    this.connectAsync();
  }

  @mobx.action
  changeServer(server: string) {
    this.server = server;
  }

  @mobx.action
  async connectAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    this.serverError = false;
    const context = new app.ContextApi(this.server);
    const openapi = await context.connectAsync();
    if (openapi.result && checkVersion(openapi.result)) {
      app.core.service.set(app.settings.contextKey, context);
      app.core.storage.set(serverKey, this.server);
      app.core.screen.changeRoot(app.RootType.Remote);
    } else if (openapi.result) {
      await app.core.dialog.versionAsync();
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
      this.serverError = true;
    } else {
      await this.connectAsync();
    }
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  server = app.core.storage.get(serverKey);

  @mobx.observable
  serverError = false;
}

function checkVersion(openapi: app.IOpenApi) {
  const client = parseVersion(app.settings.packageData.version);
  const server = parseVersion(openapi.info && openapi.info.version);
  return server.major === client.major && server.minor >= client.minor;
}

function parseVersion(value?: string) {
  const match = value && value.match(/^(\d+)\.(\d+)\.(\d+)$/);
  const version = match && {major: match[1], minor: match[2], patch: match[3]};
  return version || {major: 0, minor: 0, patch: 0};
}
