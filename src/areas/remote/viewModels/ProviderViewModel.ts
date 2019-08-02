import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class ProviderViewModel {
  private readonly _context: app.ContextApi;
  private readonly _name: app.IEnumeratorProvider;

  constructor(name: app.IEnumeratorProvider) {
    this._context = app.core.service.get(app.settings.contextKey);
    this._name = name;
  }

  @mobx.action
  changeSearch(search: string) {
    if (search === this.search) return;
    this.search = search;
    this.refreshAsync();
  }

  @mobx.action
  async openAsync(url: string) {
    this.isLoading = true;
    const series = await this._context.remote.seriesAsync(url);
    if (series.value) {
      app.core.screen.open(area.SeriesController, {series: series.value});
      mobx.runInAction(() => this.isLoading = false);
    } else if (await app.core.dialog.errorAsync(false, series.error)) {
      await this.openAsync(url);
    } else {
      mobx.runInAction(() => this.isLoading = false);
    }
  }

  @mobx.action
  async refreshAsync() {
    this.isLoading = true;
    const seriesList = this.search
      ? await this._context.remote.searchAsync(this.name, this.search)
      : await this._context.remote.popularAsync(this.name);
    if (seriesList.value) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.series = seriesList.value;
      });
    } else if (await app.core.dialog.errorAsync(true, seriesList.error)) {
      await this.refreshAsync();
    }
  }

  @mobx.computed
  get name() {
    return this._name;
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  search = '';

  @mobx.observable
  series?: app.IRemoteList;
}
