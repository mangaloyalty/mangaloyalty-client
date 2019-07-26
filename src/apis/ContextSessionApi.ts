import * as app from '..';

export class ContextSessionApi {
  private readonly _http: app.HttpApi;

  constructor(http: app.HttpApi) {
    this._http = http;
  }

  async listAsync() {
    const request = this._http.get('/api/session');
    const response = await request<app.ISessionListResponse>();
    return response;
  }

  async pageAsync(id: string, pageNumber: number) {
    const request = this._http.get(`/api/session/${encodeURIComponent(id)}?pageNumber=${pageNumber}`);
    const response = await request<app.ISessionPageResponse>();
    return response;
  }
}
