import * as app from '..';

export class ContextLibraryApi {
  private readonly _http: app.HttpApi;

  constructor(http: app.HttpApi) {
    this._http = http;
  }

  async listAsync(pageNumber = 1) {
    const request = this._http.get(`/api/library?pageNumber=${pageNumber}`);
    const response = await request<app.ILibraryListResponse>();
    return response;
  }

  async seriesCreateAsync(url: string) {
    const request = this._http.post(`/api/library?url=${encodeURIComponent(url)}`);
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
  
  async seriesPatchAsync(seriesId: string, frequency: app.ILibraryFrequency, sync: boolean) {
    const request = this._http.patch(`/api/library/${encodeURIComponent(seriesId)}?frequency=${encodeURIComponent(frequency)}&sync=${sync}`);
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
    const request = this._http.patch(`/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}?pageReadNumber=${pageReadNumber}`);
    const response = await request();
    return response;
  }
  
  async chapterUpdateAsync(seriesId: string, chapterId: string) {
    const request = this._http.put(`/api/library/${encodeURIComponent(seriesId)}/${encodeURIComponent(chapterId)}`);
    const response = await request<app.ILibraryChapterUpdateResponse>();
    return response;
  }
}
