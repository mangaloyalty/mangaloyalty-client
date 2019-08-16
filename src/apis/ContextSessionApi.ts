import * as app from '..';

export class ContextSessionApi {
  private readonly _http: app.HttpApi;

  constructor(http: app.HttpApi) {
    this._http = http;
  }

  async listAsync(seriesId?: string) {
    const query = new app.HttpQuery().add('seriesId', seriesId);
    const request = this._http.get('/api/session' + query);
    const response = await request<app.ISessionListResponse>();
    return response;
  }

  async pageAsync(id: string, pageNumber: number) {
    const query = new app.HttpQuery().add('pageNumber', pageNumber);
    const request = this._http.get(`/api/session/${encodeURIComponent(id)}` + query);
    const response = await request<app.ISessionPageResponse>();
    return response;
  }
}
