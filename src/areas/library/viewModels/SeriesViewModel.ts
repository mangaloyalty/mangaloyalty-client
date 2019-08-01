import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class SeriesViewModel {
  private readonly _context: app.ContextApi;
  private readonly _id: string;
  private readonly _title: string;

  constructor(id: string, title: string) {
    this._context = app.core.service.get(app.settings.contextKey);
    this._id = id;
    this._title = title;
    this.refreshAsync();
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
  }

  @mobx.action
  async openAsync(chapter: app.ILibrarySeriesChapter) {
    try {
      if (!this.response) return;
      this.isLoading = true;
      await new area.Navigator(this._context, this.response.chapters.indexOf(chapter), this.response).openCurrentAsync();
    } finally {
      mobx.runInAction(() => this.isLoading = false);
    }
  }

  @mobx.action
  async readAsync() {
    if (!this.response) return;
    return await this.openAsync(this.response.chapters[this.response.chapters.length - 1]);
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const series = await this._context.library.seriesReadAsync(this._id);
    if (series.value) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.response = series.value;
      });
    } else if (await app.core.dialog.errorAsync(series.error)) {
      await this.refreshAsync(true);
    }
  }

  @mobx.computed
  get chapters() {
    return this.response && this.response.chapters;
  }

  @mobx.computed
  get image() {
    return this.response && this.response.source.image;
  }

  @mobx.computed
  get summary() {
    return this.response && this.response.source.summary; 
  }

  @mobx.computed
  get title() {
    return this.response && this.response.source.title || this._title;
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  private response?: app.ILibrarySeries;
}
