import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class ChapterViewModel {
  private readonly _context: app.ContextApi;
  private readonly _series: area.SeriesViewModel;

  constructor(context: app.ContextApi, series: area.SeriesViewModel, chapter: app.ILibrarySeriesChapter) {
    this._context = context;
    this._series = series;
    this._updateWith(chapter);
  }

  @mobx.action
  async openAsync() {
    this._series.isLoading = true;
    await new area.Navigator(this._context, this._series.id, this._series.chapters, this._series.chapters.indexOf(this)).openCurrentAsync();
    mobx.runInAction(() => this._series.isLoading = false);
  }

  @mobx.action
  async statusAsync(pageCount: number, pageReadNumber: number) {
    if (this.pageReadNumber && pageReadNumber < this.pageReadNumber) {
      return;
    } else if (await this._context.library.chapterPatchAsync(this._series.id, this.id, pageReadNumber)) {
      mobx.runInAction(() => {
        this.pageCount = pageCount;
        this.pageReadNumber = pageReadNumber;
      });
    } else if (await app.core.dialog.errorAsync(true)) {
      await this.statusAsync(pageCount, pageReadNumber);
    }
  }

  @mobx.computed
  get isUnread() {
    return !this.pageCount || !this.pageReadNumber || this.pageReadNumber < this.pageCount;
  }

  @mobx.observable
  id!: string;

  @mobx.observable
  pageCount?: number;

  @mobx.observable
  pageReadNumber?: number;

  @mobx.observable
  title!: string;

  private _updateWith(chapter: app.ILibrarySeriesChapter) {
    this.id = chapter.id;
    this.pageCount = chapter.pageCount;
    this.pageReadNumber = chapter.pageReadNumber;
    this.title = chapter.title;
  }
}
