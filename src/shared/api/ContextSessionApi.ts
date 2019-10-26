import * as app from '..';

export class ContextSessionApi {
  private readonly _baseUrl: string;
  private readonly _http: app.HttpApi;

  constructor(baseUrl: string, http: app.HttpApi) {
    this._baseUrl = baseUrl;
    this._http = http;
  }

  async listAsync(seriesId?: string) {
    const query = new app.HttpQuery().add('seriesId', seriesId);
    const request = this._http.get(`${this._baseUrl}/api/session` + query);
    const response = await request.json<app.ISessionListResponse>();
    return response;
  }
    
  async pageAsync(sessionId: string, pageNumber: number) {
    const query = new app.HttpQuery().add('pageNumber', pageNumber);
    const request = this._http.get(`${this._baseUrl}/api/session/${encodeURIComponent(sessionId)}` + query);
    const response = await request.blob();
    return response;
  }
}
