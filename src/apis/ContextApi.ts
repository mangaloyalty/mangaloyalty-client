import * as app from '..';

export class ContextApi {
  private readonly _http: app.HttpApi;

  constructor(baseUrl: string) {
    this._http = !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')
      ? new app.HttpApi(`http://${baseUrl}:7783`)
      : new app.HttpApi(baseUrl);
  }

  async connectAsync() {
    const request = this._http.getAsync('/openapi.json');
    const response = await request.startAsync<app.IOpenApi>();
    return response;
  }

  async remotePopularAsync(providerName: string, pageNumber = 1) {
    const request = this._http.getAsync(`/remote/popular?providerName=${providerName}&pageNumber=${pageNumber}`);
    const response = await request.startAsync<app.IRemotePopularResponse>();
    return response;
  }

  async remoteSearch(providerName: string, title: string, pageNumber = 1) {
    const request = this._http.getAsync(`/remote/search?providerName=${providerName}&title=${encodeURIComponent(title)}&pageNumber=${pageNumber}`);
    const response = await request.startAsync<app.IRemoteSearchResponse>();
    return response;
  }

  async remoteSeries(url: string) {
    const request = this._http.getAsync(`/remote/series?url=${encodeURIComponent(url)}`);
    const response = await request.startAsync<app.IRemoteSeriesResponse>();
    return response;
  }

  async remoteStart(url: string) {
    const request = this._http.getAsync(`/remote/start?url=${encodeURIComponent(url)}`);
    const response = await request.startAsync<app.IRemoteStartResponse>();
    return response;
  }

  async sessionList() {
    const request = this._http.getAsync('/session');
    const response = await request.startAsync<app.ISessionListResponse>();
    return response;
  }

  async sessionPage(sessionId: number, pageNumber: number) {
    const request = this._http.getAsync(`/session/${sessionId}?pageNumber=${pageNumber}`);
    const response = await request.startAsync<app.ISessionPageResponse>();
    return response;
  }
}
