import * as app from '..';

export class SessionContext {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  async listAsync(seriesId?: string) {
    const query = app.http.query(['seriesId', seriesId]);
    const request = app.http.get(`${this._baseUrl}/api/session` + query);
    const response = await request.json<app.ISessionListResponse>();
    return response;
  }
    
  async pageAsync(sessionId: string, pageNumber: number) {
    const query = app.http.query(['pageNumber', pageNumber]);
    const request = app.http.get(`${this._baseUrl}/api/session/${encodeURIComponent(sessionId)}` + query);
    const response = await request.blob();
    return response;
  }
}
