import * as app from '..';
export type IClientAction = {type: 'SocketConnect'} | app.IActionListItemData;
export type IClientActionList = IClientAction[];
export type IHttpResult<T> = {error?: string, status: number, value?: T};

export interface INavigator {
  hasNext: boolean;
  hasPrevious: boolean;
  openNextAsync: (isPageNavigation: boolean) => Promise<void>;
  openPreviousAsync: (isPageNavigation: boolean) => Promise<void>;
  trackAsync?: (pageCount: number, pageReadNumber: number) => Promise<boolean>;
}

export interface ISeriesItem {
  id?: string;
  imageId?: string;
  title: string;
  unreadCount?: number;
  url: string;
}
