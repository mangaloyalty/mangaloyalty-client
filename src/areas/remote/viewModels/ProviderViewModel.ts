import * as app from '../../..';
import * as mobx from 'mobx';

export class ProviderViewModel {
  private readonly _context = app.serviceManager.get<app.ContextApi>('ContextApi');

  constructor(name: app.IProviderName) {
    this.name = name;
  }

  @mobx.action
  changeSearchTitle(searchTitle: string) {
    this.searchTitle = searchTitle;
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const seriesList = this.searchTitle
      ? await this._context.remoteSearch(this.name, this.searchTitle)
      : await this._context.remotePopularAsync(this.name);
    if (seriesList.result) {
      mobx.runInAction(() => {
        this.seriesList = seriesList.result;
        this.isLoading = false;
      });
    } else if (await app.dialogManager.errorAsync(seriesList.error)) {
      this.refreshAsync(true);
    }
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  name: app.IProviderName;

  @mobx.observable
  searchTitle = '';

  @mobx.observable
  seriesList?: app.ISeriesList;
}
