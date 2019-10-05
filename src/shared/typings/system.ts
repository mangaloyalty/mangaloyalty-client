import * as app from '..';

export interface INavigator {
  hasNext: boolean;
  hasPrevious: boolean;
  openNextAsync: () => Promise<void>;
  openPreviousAsync: () => Promise<void>;
  trackAsync?: (pageCount: number, pageReadNumber: number) => Promise<boolean>;
}

export interface ISeriesItem {
  image: string;
  title: string;
  unreadCount?: number;
}

export type ISocketAction = 
  {type: 'SeriesCreate' , seriesId: string} |
  {type: 'SeriesDelete' , seriesId: string} |
  {type: 'SeriesPatch'  , seriesId: string} |
  {type: 'SeriesUpdate' , seriesId: string} |
  {type: 'ChapterDelete', seriesId: string, chapterId: string} |
  {type: 'ChapterPatch' , seriesId: string, chapterId: string} |
  {type: 'ChapterUpdate', seriesId: string, chapterId: string} |
  {type: 'SessionCreate', session: app.ISessionListItem} |
  {type: 'SessionDelete', session: app.ISessionListItem} |
  {type: 'SessionUpdate', session: app.ISessionListItem} |
  {type: 'SocketConnect'}
