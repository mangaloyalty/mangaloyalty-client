import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

// TODO: Completing a chapter should update the list and change the unreadCount.
// TODO: Use tslib helper for more efficient resource usage.
export class SeriesViewModel {
  private readonly _context: app.ContextApi;

  constructor(series: app.ILibrarySeries, sessionList: app.ISessionList) {
    this._context = app.core.service.get(app.settings.contextKey);
    this._updateWith(series, sessionList);
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
  }

  @mobx.action
  async readAsync() {
    for (let i = this.chapters.length - 1; i >= 0; i--) if (!this.chapters[i].isReadCompleted) return await this.chapters[i].openAsync();
    app.core.toast.add(language.librarySeriesToastQuickRead);
  }

  @mobx.action
  async refreshAsync(userInitiated = true) {
    this.isLoading = userInitiated;
    const seriesPromise = this._context.library.seriesReadAsync(this.id);
    const sessionListPromise = this._context.session.listAsync(this.id);
    const series = await seriesPromise;
    const sessionList = await sessionListPromise;
    if (series.value && sessionList.value) {
      this._updateWith(series.value, sessionList.value);
      this.isLoading = false;
    } else if (userInitiated && await app.core.dialog.errorAsync(true, series.error, sessionList.error)) {
      await this.refreshAsync();
    }
  }

  @mobx.action
  async repeatAsync() {
    this.refreshAsync(false);
  }

  @mobx.observable
  chapters!: app.ChapterViewModel[];

  @mobx.observable
  id!: string;

  @mobx.observable
  image!: string;

  @mobx.observable
  isLoading = false;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  summary?: string;

  @mobx.observable
  title!: string;

  private _updateWith(series: app.ILibrarySeries, sessionList: app.ISessionList) {
    this.id = series.id;
    this.image = series.source.image;
    this.summary = series.source.summary;
    this.title = series.source.title;
    this.chapters = series.chapters.map((chapter) => this._viewModelFor(chapter, sessionList));
  }

  private _viewModelFor(chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList) {
    const vm = this.chapters && this.chapters.find((vm) => chapter.id === vm.id);
    if (vm) return vm.refreshWith(chapter, checkIsSynchronizing(this.id, chapter, sessionList));
    return new app.ChapterViewModel(this._context, this, chapter, checkIsSynchronizing(this.id, chapter, sessionList));
  }
}

function checkIsSynchronizing(seriesId: string, chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList) {
  return sessionList.some((session) => !session.finishedAt
    && session.library
    && session.library.seriesId === seriesId
    && session.library.chapterId === chapter.id
    && session.library.sync)
}
