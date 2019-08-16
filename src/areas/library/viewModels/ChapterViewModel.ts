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
  async statusAsync(isReadCompleted?: boolean, pageReadNumber?: number) {
    if (await this._context.library.chapterPatchAsync(this._series.id, this.id, isReadCompleted, pageReadNumber)) {
      mobx.runInAction(() => {
        this.isReadCompleted = this.isReadCompleted || isReadCompleted;
        this.pageReadNumber = pageReadNumber;
      });
    } else if (await app.core.dialog.errorAsync(true)) {
      await this.statusAsync(isReadCompleted, pageReadNumber);
    }
  }

  @mobx.action
  async toggleReadCompleted() {
    if (await this._context.library.chapterPatchAsync(this._series.id, this.id, !this.isReadCompleted)) {
      mobx.runInAction(() => this.isReadCompleted = !this.isReadCompleted);
    } else if (await app.core.dialog.errorAsync(true)) {
      await this.toggleReadCompleted();
    }
  }

  @mobx.computed
  get isSynchronized() {
    return Boolean(this.syncAt);
  }

  @mobx.observable
  id!: string;

  @mobx.observable
  isReadCompleted?: boolean;

  @mobx.observable
  pageReadNumber?: number;

  @mobx.observable
  syncAt?: number;

  @mobx.observable
  title!: string;

  private _updateWith(chapter: app.ILibrarySeriesChapter) {
    this.id = chapter.id;
    this.isReadCompleted = chapter.isReadCompleted;
    this.pageReadNumber = chapter.pageReadNumber;
    this.syncAt = chapter.syncAt;
    this.title = chapter.title;
  }
}
