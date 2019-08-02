import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

// TODO: Make the dependent SeriesViewModel be pre-loaded with data as well, and remove id/chapter checks here.
export class ChapterViewModel {
  constructor(private _context: app.ContextApi, private _series: area.SeriesViewModel, chapter: app.ILibrarySeriesChapter) {
    this.id = chapter.id;
    this.pageCount = chapter.pageCount;
    this.pageReadNumber = chapter.pageReadNumber;
    this.title = chapter.title;
  }

  @mobx.action
  async openAsync() {
    try {
      if (!this._series.chapters || !this._series.id) return;
      this._series.isLoading = true;
      await new area.Navigator(this._context, this._series.id, this._series.chapters, this._series.chapters.indexOf(this)).openCurrentAsync();
    } finally {
      mobx.runInAction(() => this._series.isLoading = false);
    }
  }

  @mobx.action
  async updateStatusAsync(pageCount: number, pageReadNumber: number) {
    if (!this._series.id || (this.pageReadNumber && pageReadNumber < this.pageReadNumber)) return;
    await this._context.library.chapterPatchAsync(this._series.id, this.id, pageReadNumber);
    mobx.runInAction(() => {
      this.pageCount = pageCount;
      this.pageReadNumber = pageReadNumber;
    });
  }

  @mobx.computed
  get isUnread() {
    return !this.pageCount || !this.pageReadNumber || this.pageReadNumber < this.pageCount;
  }

  @mobx.observable
  id: string;

  @mobx.observable
  pageCount?: number;

  @mobx.observable
  pageReadNumber?: number;

  @mobx.observable
  title: string;
}
