import * as app from '..';

export class ContextApi {
  private readonly _http: app.HttpApi;
  private readonly _library: app.ContextLibraryApi;
  private readonly _remote: app.ContextRemoteApi;
  private readonly _session: app.ContextSessionApi;

  constructor(baseUrl: string) {
    this._http = new app.HttpApi(!/^https?:\/\//.test(baseUrl) ? `http://${baseUrl}` : baseUrl);
    this._library = new app.ContextLibraryApi(this._http);
    this._remote = new app.ContextRemoteApi(this._http);
    this._session = new app.ContextSessionApi(this._http);
  }

  async connectAsync() {
    const request = this._http.get('/openapi.json');
    const response = await request<app.IOpenApi>();
    return response;
  }

  get library() {
    return this._library;
  }
  
  get remote() {
    return this._remote;
  }

  get session() {
    return this._session;
  }
}
