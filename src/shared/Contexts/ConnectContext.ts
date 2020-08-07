import * as app from '..';

export class ConnectContext implements app.IConnectContext {
  constructor(baseUrl: string) {
    this.library = new app.LibraryContext(baseUrl);
    this.remote = new app.RemoteContext(baseUrl);
    this.session = new app.SessionContext(baseUrl);
    this.socket = new app.SocketContext(baseUrl);
  }

  readonly library: app.ILibraryContext;
  readonly remote: app.IRemoteContext;
  readonly session: app.ISessionContext;
  readonly socket: app.ISocketContext;
}
