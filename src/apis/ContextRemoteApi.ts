import * as app from '..';

export class ContextRemoteApi {
  private readonly _http: app.HttpApi;

  constructor(http: app.HttpApi) {
    this._http = http;
  }

  async popularAsync(providerName: string, pageNumber = 1) {
    const request = this._http.get(`/api/remote/popular?providerName=${encodeURIComponent(providerName)}&pageNumber=${pageNumber}`);
    const response = await request<app.IRemotePopularResponse>();
    return response;
  }

  async searchAsync(providerName: string, title: string, pageNumber = 1) {
    const request = this._http.get(`/api/remote/search?providerName=${encodeURIComponent(providerName)}&title=${encodeURIComponent(title)}&pageNumber=${pageNumber}`);
    const response = await request<app.IRemoteSearchResponse>();
    return response;
  }

  async seriesAsync(url: string) {
    const request = this._http.get(`/api/remote/series?url=${encodeURIComponent(url)}`);
    const response = await request<app.IRemoteSeriesResponse>();
    return response;
  }

  async startAsync(url: string) {
    const request = this._http.get(`/api/remote/start?url=${encodeURIComponent(url)}`);
    const response = await request<app.IRemoteStartResponse>();
    return response;
  }
}
