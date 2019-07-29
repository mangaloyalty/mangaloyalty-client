import * as app from '..';

export class ContextRemoteApi {
  private readonly _http: app.HttpApi;

  constructor(http: app.HttpApi) {
    this._http = http;
  }

  async popularAsync(providerName: app.IEnumeratorProvider, pageNumber?: number) {
    const query = new app.HttpQuery().add('providerName', providerName).add('pageNumber', pageNumber);
    const request = this._http.get('/api/remote/popular' + query);
    const response = await request<app.IRemotePopularResponse>();
    return response;
  }

  async searchAsync(providerName: app.IEnumeratorProvider, title: string, pageNumber?: number) {
    const query = new app.HttpQuery().add('providerName', providerName).add('title', title).add('pageNumber', pageNumber);
    const request = this._http.get('/api/remote/search' + query);
    const response = await request<app.IRemoteSearchResponse>();
    return response;
  }

  async seriesAsync(url: string) {
    const query = new app.HttpQuery().add('url', url);
    const request = this._http.get('/api/remote/series' + query);
    const response = await request<app.IRemoteSeriesResponse>();
    return response;
  }

  async startAsync(url: string) {
    const query = new app.HttpQuery().add('url', url);
    const request = this._http.get('/api/remote/start' + query);
    const response = await request<app.IRemoteStartResponse>();
    return response;
  }
}
