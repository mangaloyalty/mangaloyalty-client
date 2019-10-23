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
    const response = await request<app.ISessionListResponse>();
    return response;
  }
    
  async pageAsync(sessionId: string, pageNumber: number) {
    const query = new app.HttpQuery().add('pageNumber', pageNumber);
    const response = await fetch(`${this._baseUrl}/api/session/${encodeURIComponent(sessionId)}` + query);
    return createAsync(response);
  }
}

// TODO: Use fetch-based API for JSON calls, too.
// TODO: Use fetch-based with an added timeout.
async function createAsync(response: Response) {
  if (response.status === 200) {
    const status = response.status;
    const value = await response.blob();
    return {status, value};
  } else {
    const data = await response.json() as {error?: string};
    const error = data.error;
    const status = response.status;
    return {error, status};
  }
}
