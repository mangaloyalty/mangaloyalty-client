import * as app from '../../..';
import * as mobx from 'mobx';

// TODO: Normalize refreshAsync?
export class ProviderViewModel {
  private readonly _context: app.ContextApi;

  constructor(name: app.IProviderName) {
    this._context = app.serviceManager.get<app.ContextApi>('ContextApi');
    this.name = name;
  }

  @mobx.action
  changeSearch(search: string) {
    this.search = search;
    this.refreshAsync();
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const seriesList = this.search
      ? await this._context.remoteSearch(this.name, this.search)
      : await this._context.remotePopularAsync(this.name);
    if (seriesList) {
      mobx.runInAction(() => {
        this.seriesList = seriesList;
        this.isLoading = false;
      });
    } else if (await app.dialogManager.openErrorAsync()) {
      this.refreshAsync(true);
    }
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  name: app.IProviderName;

  @mobx.observable
  search = '';

  @mobx.observable
  seriesList?: app.ISeriesList;
}
