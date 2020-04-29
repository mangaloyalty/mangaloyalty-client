import * as app from '..';

export class RemoteContext implements app.IRemoteContext {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  async imageAsync(imageId: string) {
    const query = app.http.query(['imageId', imageId]);
    const request = app.http.get(`${this._baseUrl}/api/remote/image` + query);
    const response = await request.blob();
    return response;
  }

  async popularAsync(providerName: app.IEnumeratorProvider, pageNumber?: number) {
    const query = app.http.query(['providerName', providerName], ['pageNumber', pageNumber]);
    const request = app.http.get(`${this._baseUrl}/api/remote/popular` + query);
    const response = await request.json<app.IRemotePopularResponse>();
    return response;
  }

  async searchAsync(providerName: app.IEnumeratorProvider, title: string, pageNumber?: number) {
    const query = app.http.query(['providerName', providerName], ['title', title], ['pageNumber', pageNumber]);
    const request = app.http.get(`${this._baseUrl}/api/remote/search` + query);
    const response = await request.json<app.IRemoteSearchResponse>();
    return response;
  }

  async seriesAsync(url: string) {
    const query = app.http.query(['url', url]);
    const request = app.http.get(`${this._baseUrl}/api/remote/series` + query);
    const response = await request.json<app.IRemoteSeriesResponse>();
    return response;
  }

  async startAsync(url: string) {
    const query = app.http.query(['url', url]);
    const request = app.http.get(`${this._baseUrl}/api/remote/start` + query);
    const response = await request.json<app.IRemoteStartResponse>();
    return response;
  }
}
