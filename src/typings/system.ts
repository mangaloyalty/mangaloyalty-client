export interface INavigator {
  hasNext: boolean;
  hasPrevious: boolean;
  openNextAsync: () => Promise<void>;
  openPreviousAsync: () => Promise<void>;
}
