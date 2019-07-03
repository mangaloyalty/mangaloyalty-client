import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class ProviderViewModel {
  private readonly _context = app.serviceManager.get<app.ContextApi>('ContextApi');

  constructor(name: app.IProviderName, searchTitle: string) {
    this.name = name;
    this.searchTitle = searchTitle;
    this.refreshAsync();
  }

  @mobx.action
  changeSearchTitle(searchTitle: string) {
    this.searchTitle = searchTitle;
    this.refreshAsync();
  }

  @mobx.action
  open(series: app.ISeriesListItem) {
    app.screenManager.open(area.SeriesController, {
      title: series.title,
      url: series.url
    });
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
        this.series = seriesList.result;
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
  series?: app.ISeriesList;
}
