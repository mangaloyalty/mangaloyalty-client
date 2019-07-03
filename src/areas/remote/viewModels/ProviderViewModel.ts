import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';
const core = app.core;

export class ProviderViewModel {
  private readonly _context: app.ContextApi;
  private readonly _name: app.IProviderName;

  constructor(name: app.IProviderName) {
    this._context = core.service.get('ContextApi');
    this._name = name;
  }

  @mobx.action
  changeSearch(search: string) {
    this.search = search;
    this.refreshAsync();
  }

  @mobx.action
  open(series: app.ISeriesListItem) {
    core.screen.open(area.SeriesController, {
      title: series.title,
      url: series.url
    });
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const seriesList = this.search
      ? await this._context.remoteSearch(this.name, this.search)
      : await this._context.remotePopularAsync(this.name);
    if (seriesList.result) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.source = seriesList.result;
      });
    } else if (await core.dialog.errorAsync(seriesList.error)) {
      this.refreshAsync(true);
    }
  }

  @mobx.computed
  get name() {
    return this._name;
  }

  @mobx.computed
  get series() {
    return this.source;
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  search = '';

  @mobx.observable
  private source?: app.ISeriesList;
}
