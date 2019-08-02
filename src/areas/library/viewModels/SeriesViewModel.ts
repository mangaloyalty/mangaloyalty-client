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
  async readAsync() {
    if (!this.chapters) return;
    for (let i = this.chapters.length - 1; i >= 0; i--) {
      const chapter = this.chapters[i];
      if (!chapter.isUnread) continue;
      await chapter.openAsync();
      return;
    }
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
    return this.response && this.response.chapters.map((chapter) => new area.ChapterViewModel(this._context, this, chapter));
  }

  @mobx.computed
  get id() {
    return this.response && this.response.id;
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
