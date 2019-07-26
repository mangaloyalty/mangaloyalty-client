import * as app from '..';

export class ContextLibraryApi {
  private readonly _http: app.HttpApi;

  constructor(http: app.HttpApi) {
    this._http = http;
  }

  async listAsync(sortBy: app.IEnumeratorSortBy, title?: string, pageNumber?: number) {
    const query = new app.HttpQuery().add('sortBy', sortBy).add('title', title).add('pageNumber', pageNumber);
    const request = this._http.get('/api/library' + query);
    const response = await request<app.ILibraryListResponse>();
    return response;
  }

  async seriesCreateAsync(url: string) {
    const query = new app.HttpQuery().add('url', url);
    const request = this._http.post('/api/library' + query);
    const response = await request<app.ILibrarySeriesCreateResponse>();
    return response;
  }

  async seriesDeleteAsync(seriesId: string) {
    const request = this._http.delete(`/api/library/${encodeURIComponent(seriesId)}`);
    const response = await request();
    return response;
  }
  
  async seriesReadAsync(seriesId: string) {
    const request = this._http.get(`/api/library/${encodeURIComponent(seriesId)}`);
    const response = await request<app.ILibrarySeriesReadResponse>();
    return response;
  }
  
  async seriesPatchAsync(seriesId: string, frequency: app.IEnumeratorFrequency, sync: boolean) {
    const query = new app.HttpQuery().add('frequency', frequency).add('sync', sync);
    const request = this._http.patch(`/api/library/${encodeURIComponent(seriesId)}` + query);
    const response = await request();
    return response;
  }

  async seriesUpdateAsync(seriesId: string) {
    const request = this._http.put(`/api/library/${encodeURIComponent(seriesId)}`);
    const response = await request<app.ILibrarySeriesUpdateResponse>();
    return response;
  }
  
  async chapterDeleteAsync(seriesId: string, chapterId: string) {
    const request = this._http.delete(`/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request();
    return response;
  }
  
  async chapterReadAsync(seriesId: string, chapterId: string) {
    const request = this._http.get(`/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request<app.ILibraryChapterReadResponse>();
    return response;
  }
  
  async chapterPatchAsync(seriesId: string, chapterId: string, pageReadNumber: number) {
    const query = new app.HttpQuery().add('pageReadNumber', pageReadNumber);
    const request = this._http.patch(`/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}` + query);
    const response = await request();
    return response;
  }
  
  async chapterUpdateAsync(seriesId: string, chapterId: string) {
    const request = this._http.put(`/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request<app.ILibraryChapterUpdateResponse>();
    return response;
  }
}
