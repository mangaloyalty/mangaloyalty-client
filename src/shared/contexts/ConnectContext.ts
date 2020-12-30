import * as app from '..';

export class ConnectContext {
  constructor(baseUrl: string) {
    this.action = new app.ActionContext(baseUrl);
    this.library = new app.LibraryContext(baseUrl);
    this.remote = new app.RemoteContext(baseUrl);
    this.session = new app.SessionContext(baseUrl);
  }

  readonly action: app.ActionContext;
  readonly library: app.LibraryContext;
  readonly remote: app.RemoteContext;
  readonly session: app.SessionContext;
}
