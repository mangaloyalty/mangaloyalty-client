import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class SeriesViewModel {
  private readonly _context: app.ContextApi;
  private readonly _title: string;
  private readonly _url: string;

  constructor(title: string, url: string) {
    this._context = app.core.service.get(app.settings.contextKey);
    this._title = title;
    this._url = url;
    this.refreshAsync();
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
  }

  @mobx.action
  async openAsync(chapter: app.IRemoteSeriesChapter) {
    if (!this.source) return;
    const navigator = new area.Navigator(this._context, this.source.chapters.indexOf(chapter), this.source);
    this.isLoading = true;
    await navigator.openCurrentAsync();
    mobx.runInAction(() => this.isLoading = false);
  }

  @mobx.action
  async readAsync() {
    if (!this.source) return;
    return await this.openAsync(this.source.chapters[this.source.chapters.length - 1]);
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const series = await this._context.remote.seriesAsync(this._url);
    if (series.value) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.source = series.value;
      });
    } else if (await app.core.dialog.errorAsync(series.error)) {
      await this.refreshAsync(true);
    }
  }

  @mobx.computed
  get chapters() {
    return this.source && this.source.chapters;
  }

  @mobx.computed
  get image() {
    return this.source && this.source.image;
  }

  @mobx.computed
  get summary() {
    return this.source && this.source.summary; 
  }

  @mobx.computed
  get title() {
    return this.source && this.source.title || this._title;
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  private source?: app.IRemoteSeries;
}
