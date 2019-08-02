export interface INavigator {
  hasNext: boolean;
  hasPrevious: boolean;
  openNextAsync: () => Promise<void>;
  openPreviousAsync: () => Promise<void>;
  updateStatusAsync: (pageCount: number, pageReadNumber: number) => Promise<void>;
}

export interface IOpenApi {
  info?: {version?: string};
}

export interface ISeriesItem {
  image: string;
  title: string;
  unreadCount?: number;
}
