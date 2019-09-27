export interface INavigator {
  hasNext: boolean;
  hasPrevious: boolean;
  openNextAsync: () => Promise<void>;
  openPreviousAsync: () => Promise<void>;
  trackAsync?: (pageCount: number, pageReadNumber: number) => Promise<boolean>;
}

export interface IOpenApi {
  info?: {version?: string};
}

export interface ISeriesItem {
  image: string;
  title: string;
  unreadCount?: number;
}
