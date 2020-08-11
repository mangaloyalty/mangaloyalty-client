import * as app from '..';

export class LibraryContext {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  async listReadAsync(readStatus: app.IEnumeratorReadStatus, seriesStatus: app.IEnumeratorSeriesStatus, sortKey: app.IEnumeratorSortKey, title?: string) {
    const query = app.http.query(['readStatus', readStatus], ['seriesStatus', seriesStatus], ['sortKey', sortKey], ['title', title]);
    const request = app.http.get(`${this._baseUrl}/api/library` + query);
    const response = await request.json<app.ILibraryListReadResponse>();
    return response;
  }

  async seriesCreateAsync(url: string) {
    const query = app.http.query(['url', url]);
    const request = app.http.post(`${this._baseUrl}/api/library` + query);
    const response = await request.json<app.ILibrarySeriesCreateResponse>();
    return response;
  }

  async seriesDeleteAsync(seriesId: string) {
    const request = app.http.delete(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}`);
    const response = await request.status();
    return response;
  }
  
  seriesDumpAsync(seriesId: string) {
    window.location.href = `${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/dump`;
    return Promise.resolve({status: 200});
  }

  async seriesImageAsync(seriesId: string) {
    const request = app.http.get(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/image`);
    const response = await request.blob();
    return response;
  }
  
  async seriesReadAsync(seriesId: string) {
    const request = app.http.get(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}`);
    const response = await request.json<app.ILibrarySeriesReadResponse>();
    return response;
  }
  
  async seriesPatchAsync(seriesId: string, frequency: app.IEnumeratorFrequency, strategy: app.IEnumeratorStrategy) {
    const query = app.http.query(['frequency', frequency], ['strategy', strategy]);
    const request = app.http.patch(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}` + query);
    const response = await request.status();
    return response;
  }

  async seriesUpdateAsync(seriesId: string) {
    const request = app.http.put(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}`);
    const response = await request.status();
    return response;
  }
  
  async chapterDeleteAsync(seriesId: string, chapterId: string) {
    const request = app.http.delete(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request.status();
    return response;
  }
  
  async chapterReadAsync(seriesId: string, chapterId: string) {
    const request = app.http.get(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request.json<app.ILibraryChapterReadResponse>();
    return response;
  }
  
  async chapterPatchAsync(seriesId: string, chapterId: string, isReadCompleted?: boolean, pageReadNumber?: number) {
    const query = app.http.query(['isReadCompleted', isReadCompleted], ['pageReadNumber', pageReadNumber]);
    const request = app.http.patch(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}` + query);
    const response = await request.status();
    return response;
  }
  
  async chapterUpdateAsync(seriesId: string, chapterId: string) {
    const request = app.http.put(`${this._baseUrl}/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request.status();
    return response;
  }
}
