import * as app from '..';

export class ContextLibraryApi {
  private readonly _baseUrl: string;
  private readonly _http: app.HttpApi;

  constructor(baseUrl: string, http: app.HttpApi) {
    this._baseUrl = baseUrl;
    this._http = http;
  }

  async listAsync(readStatus: app.IEnumeratorReadStatus, seriesStatus: app.IEnumeratorSeriesStatus, sortKey: app.IEnumeratorSortKey, title?: string, pageNumber?: number) {
    const query = new app.HttpQuery().add('readStatus', readStatus).add('seriesStatus', seriesStatus).add('sortKey', sortKey).add('title', title).add('pageNumber', pageNumber);
    const request = this._http.get(`${this._baseUrl}/api/library` + query);
    const response = await request.json<app.ILibraryListResponse>();
    return response;
  }

  async seriesCreateAsync(url: string) {
    const query = new app.HttpQuery().add('url', url);
    const request = this._http.post(`${this._baseUrl}/api/library` + query);
    const response = await request.json<app.ILibrarySeriesCreateResponse>();
    return response;
  }

  async seriesDeleteAsync(seriesId: string) {
    const request = this._http.delete(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}`);
    const response = await request.status();
    return response;
  }
  
  seriesImageUrl(seriesId: string) {
    const requestUrl = `${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/image`;
    return requestUrl;
  }

  async seriesReadAsync(seriesId: string) {
    const request = this._http.get(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}`);
    const response = await request.json<app.ILibrarySeriesReadResponse>();
    return response;
  }
  
  async seriesPatchAsync(seriesId: string, frequency: app.IEnumeratorFrequency, syncAll: boolean) {
    const query = new app.HttpQuery().add('frequency', frequency).add('syncAll', syncAll);
    const request = this._http.patch(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}` + query);
    const response = await request.status();
    return response;
  }

  async seriesUpdateAsync(seriesId: string) {
    const request = this._http.put(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}`);
    const response = await request.status();
    return response;
  }
  
  async chapterDeleteAsync(seriesId: string, chapterId: string) {
    const request = this._http.delete(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request.status();
    return response;
  }
  
  async chapterReadAsync(seriesId: string, chapterId: string) {
    const request = this._http.get(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request.json<app.ILibraryChapterReadResponse>();
    return response;
  }
  
  async chapterPatchAsync(seriesId: string, chapterId: string, isReadCompleted?: boolean, pageReadNumber?: number) {
    const query = new app.HttpQuery().add('isReadCompleted', isReadCompleted).add('pageReadNumber', pageReadNumber);
    const request = this._http.patch(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}` + query);
    const response = await request.status();
    return response;
  }
  
  async chapterUpdateAsync(seriesId: string, chapterId: string) {
    const request = this._http.put(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request.status();
    return response;
  }
}
