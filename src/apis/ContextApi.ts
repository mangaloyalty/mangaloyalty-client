import * as app from '..';

export class ContextApi {
  private readonly _http: app.HttpApi;

  constructor(baseUrl: string) {
    this._http = !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')
      ? new app.HttpApi(`http://${baseUrl}:7783`)
      : new app.HttpApi(baseUrl);
  }

  async connectAsync() {
    const request = this._http.get('/openapi.json');
    const response = await request<app.IOpenApi>();
    return response;
  }

  async remotePopularAsync(providerName: string, pageNumber = 1) {
    const request = this._http.get(`/api/remote/popular?providerName=${providerName}&pageNumber=${pageNumber}`);
    const response = await request<app.IRemotePopularResponse>();
    return response;
  }

  async remoteSearch(providerName: string, title: string, pageNumber = 1) {
    const request = this._http.get(`/api/remote/search?providerName=${providerName}&title=${encodeURIComponent(title)}&pageNumber=${pageNumber}`);
    const response = await request<app.IRemoteSearchResponse>();
    return response;
  }

  async remoteSeries(url: string) {
    const request = this._http.get(`/api/remote/series?url=${encodeURIComponent(url)}`);
    const response = await request<app.IRemoteSeriesResponse>();
    return response;
  }

  async remoteStart(url: string) {
    const request = this._http.get(`/api/remote/start?url=${encodeURIComponent(url)}`);
    const response = await request<app.IRemoteStartResponse>();
    return response;
  }

  async sessionList() {
    const request = this._http.get('/api/session');
    const response = await request<app.ISessionListResponse>();
    return response;
  }

  async sessionPage(id: number, pageNumber: number) {
    const request = this._http.get(`/api/session/${id}?pageNumber=${pageNumber}`);
    const response = await request<app.ISessionPageResponse>();
    return response;
  }
}
