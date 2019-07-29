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
  open(series: app.IRemoteListItem) {
    app.core.screen.open(area.SeriesController, {
      title: series.title,
      url: series.url
    });
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const seriesList = this.search
      ? await this._context.remote.searchAsync(this.name, this.search)
      : await this._context.remote.popularAsync(this.name);
    if (seriesList.value) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.source = seriesList.value;
      });
    } else if (await app.core.dialog.errorAsync(seriesList.error)) {
      await this.refreshAsync(true);
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
  private source?: app.IRemoteList;
}
