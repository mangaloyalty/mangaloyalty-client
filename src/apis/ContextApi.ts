import * as app from '..';

export class ContextApi {
  private readonly _http: app.HttpApi;

  constructor(baseUrl: string) {
    this._http = new app.HttpApi(baseUrl);
  }

  async remotePopularAsync(providerName: app.IProviderName, pageNumber = 1) {
    const request = this._http.getAsync(`/remote/popular?providerName=${providerName}&pageNumber=${pageNumber}`);
    const response = await request.runAsync<app.IRemotePopularResponse>();
    return response;
  }

  async remoteSearch(providerName: app.IProviderName, title: string, pageNumber = 1) {
    const request = this._http.getAsync(`/remote/search?providerName=${providerName}&title=${encodeURIComponent(title)}&pageNumber=${pageNumber}`);
    const response = await request.runAsync<app.IRemoteSearchResponse>();
    return response;
  }
}
