/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type IEnumeratorProvider = "batoto" | "fanfox";
export type IEnumeratorFrequency = "never" | "hourly" | "daily" | "weekly" | "monthly";
export type IEnumeratorStrategy = "none" | "unread" | "all";
export type IEnumeratorReadStatus = "all" | "unread" | "read";
export type IEnumeratorSeriesStatus = "all" | "ongoing" | "completed";
export type IEnumeratorSortKey = "addedAt" | "lastChapterAddedAt" | "lastPageReadAt" | "title";
export type IProviderChapterUrl = string;
export type IProviderSeriesUrl = string;
export type ILibraryList = ILibraryListItem[];
export type ISessionList = ISessionListItem[];

export interface ILibraryResult {
  id: string;
}
export interface ILibraryListItem {
  id: string;
  title: string;
  unreadCount: number;
  url: string;
}
export interface ILibrarySeries {
  id: string;
  addedAt: number;
  lastChapterAddedAt?: number;
  lastPageReadAt?: number;
  lastSyncAt: number;
  automation: ILibrarySeriesAutomation;
  chapters: ILibrarySeriesChapter[];
  source: ILibrarySeriesSource;
}
export interface ILibrarySeriesAutomation {
  checkedAt?: number;
  frequency: IEnumeratorFrequency;
  strategy: IEnumeratorStrategy;
}
export interface ILibrarySeriesChapter {
  id: string;
  addedAt: number;
  deletedAt?: number;
  syncAt?: number;
  isReadCompleted?: boolean;
  pageCount?: number;
  pageReadNumber?: number;
  title: string;
  url: string;
}
export interface ILibrarySeriesSource {
  authors: string[];
  genres: string[];
  isCompleted: boolean;
  summary?: string;
  title: string;
  url: string;
}
export interface IRemoteList {
  hasMorePages: boolean;
  items: IRemoteListItem[];
}
export interface IRemoteListItem {
  imageId: string;
  title: string;
  url: string;
}
export interface IRemoteSeries {
  authors: string[];
  chapters: IRemoteSeriesChapter[];
  genres: string[];
  imageId: string;
  isCompleted: boolean;
  summary?: string;
  title: string;
  url: string;
}
export interface IRemoteSeriesChapter {
  title: string;
  url: string;
}
export interface ISessionListItem {
  id: string;
  finishedAt?: number;
  pageCount: number;
  url: string;
  library?: {
    seriesId: string;
    chapterId: string;
    sync: boolean;
  };
}
export interface ILibraryListContext {
  query: {
    readStatus: IEnumeratorReadStatus;
    seriesStatus: IEnumeratorSeriesStatus;
    sortKey: IEnumeratorSortKey;
    title?: string;
  };
}
export interface ILibrarySeriesCreateContext {
  query: {
    url: IProviderSeriesUrl;
  };
}
export interface ILibrarySeriesDeleteContext {
  path: {
    seriesId: string;
  };
}
export interface ILibrarySeriesReadContext {
  path: {
    seriesId: string;
  };
}
export interface ILibrarySeriesUpdateContext {
  path: {
    seriesId: string;
  };
}
export interface ILibrarySeriesPatchContext {
  path: {
    seriesId: string;
  };
  query: {
    frequency: IEnumeratorFrequency;
    strategy: IEnumeratorStrategy;
  };
}
export interface ILibrarySeriesDumpContext {
  path: {
    seriesId: string;
  };
}
export interface ILibrarySeriesImageContext {
  path: {
    seriesId: string;
  };
}
export interface ILibraryChapterDeleteContext {
  path: {
    seriesId: string;
    chapterId: string;
  };
}
export interface ILibraryChapterReadContext {
  path: {
    seriesId: string;
    chapterId: string;
  };
}
export interface ILibraryChapterUpdateContext {
  path: {
    seriesId: string;
    chapterId: string;
  };
}
export interface ILibraryChapterPatchContext {
  path: {
    seriesId: string;
    chapterId: string;
  };
  query: {
    isReadCompleted?: boolean;
    pageReadNumber?: number;
  };
}
export interface IRemoteImageContext {
  query: {
    imageId: string;
  };
}
export interface IRemotePopularContext {
  query: {
    providerName: IEnumeratorProvider;
    pageNumber?: number;
  };
}
export interface IRemoteSearchContext {
  query: {
    providerName: IEnumeratorProvider;
    title: string;
    pageNumber?: number;
  };
}
export interface IRemoteSeriesContext {
  query: {
    url: IProviderSeriesUrl;
  };
}
export interface IRemoteStartContext {
  query: {
    url: IProviderChapterUrl;
  };
}
export interface ISessionListContext {
  query: {
    seriesId?: string;
  };
}
export interface ISessionPageContext {
  path: {
    sessionId: string;
  };
  query: {
    pageNumber: number;
  };
}

export type ILibraryListResponse = ILibraryList;
export type ILibrarySeriesCreateResponse = ILibraryResult;
export type ILibrarySeriesReadResponse = ILibrarySeries;
export type ILibraryChapterReadResponse = ISessionListItem;
export type IRemotePopularResponse = IRemoteList;
export type IRemoteSearchResponse = IRemoteList;
export type IRemoteSeriesResponse = IRemoteSeries;
export type IRemoteStartResponse = ISessionListItem;
export type ISessionListResponse = ISessionList;