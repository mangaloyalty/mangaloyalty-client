import * as app from '..';
export type ContextResult<T> = Promise<{error?: string, status: number, value?: T}>;

export interface ILibraryContext {
  readonly enable: {seriesDump: boolean};
  listReadAsync(readStatus: app.IEnumeratorReadStatus, seriesStatus: app.IEnumeratorSeriesStatus, sortKey: app.IEnumeratorSortKey, title?: string): app.ContextResult<app.ILibraryListResponse>;
  seriesCreateAsync(url: string): app.ContextResult<app.ILibrarySeriesCreateResponse>;
  seriesDeleteAsync(seriesId: string): app.ContextResult<void>;
  seriesDumpAsync(seriesId: string): app.ContextResult<void>;
  seriesImageAsync(seriesId: string): app.ContextResult<Blob>;
  seriesReadAsync(seriesId: string): app.ContextResult<app.ILibrarySeries>;
  seriesPatchAsync(seriesId: string, frequency: app.IEnumeratorFrequency, strategy: app.IEnumeratorStrategy): app.ContextResult<void>;
  seriesUpdateAsync(seriesId: string): app.ContextResult<void>;
  chapterDeleteAsync(seriesId: string, chapterId: string): app.ContextResult<void>;
  chapterReadAsync(seriesId: string, chapterId: string): app.ContextResult<app.ISessionListItem>;
  chapterPatchAsync(seriesId: string, chapterId: string, isReadCompleted?: boolean, pageReadNumber?: number): app.ContextResult<void>;
  chapterUpdateAsync(seriesId: string, chapterId: string): app.ContextResult<void>;
}

export interface IRemoteContext {
  imageAsync(imageId: string): app.ContextResult<Blob>;
  popularAsync(providerName: app.IEnumeratorProvider, pageNumber?: number): app.ContextResult<app.IRemotePopularResponse>;
  searchAsync(providerName: app.IEnumeratorProvider, title: string, pageNumber?: number): app.ContextResult<app.IRemoteSearchResponse>;
  seriesAsync(url: string): app.ContextResult<app.IRemoteSeriesResponse>;
  startAsync(url: string): app.ContextResult<app.IRemoteStartResponse>;
}

export interface ISessionContext {
  listAsync(seriesId?: string): app.ContextResult<app.ISessionListResponse>;
  pageAsync(sessionId: string, pageNumber: number): app.ContextResult<Blob>;
}

export interface ISocketContext {
  attach(): void;
  createQueue(): app.ISocketQueue;
}

export interface ISocketQueue {
  attach(): ISocketQueue;
  detach(): void;
  mount(consumeAsync: (actions: app.ISocketAction[]) => Promise<void>): void;
}
