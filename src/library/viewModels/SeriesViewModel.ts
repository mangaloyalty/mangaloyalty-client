import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesViewModel {
  private readonly _context = app.core.service.get<app.ContextApi>(app.settings.contextKey);
  private readonly _id: string;

  constructor(id: string) {
    this._id = id;
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
  }

  @mobx.action
  async deleteAsync() {
    if (await app.core.dialog.deleteAsync()) return;
    // TODO: Delete series, close screen, refresh list.
  }

  @mobx.action
  async readAsync() {
    for (let i = this.chapters.length - 1; i >= 0; i--) if (!this.chapters[i].isReadCompleted) return await this.chapters[i].openAsync();
    app.core.toast.add(language.librarySeriesToastQuickRead);
  }

  @mobx.action
  async refreshAsync(userInitiated = true) {
    this.isLoading = userInitiated;
    const seriesPromise = this._context.library.seriesReadAsync(this._id);
    const sessionListPromise = this._context.session.listAsync(this._id);
    const series = await seriesPromise;
    const sessionList = await sessionListPromise;
    if (series.value && sessionList.value) {
      this.image = series.value.source.image;
      this.summary = series.value.source.summary;
      this.title = series.value.source.title;
      this.chapters = series.value.chapters.map((chapter) => this._viewModelFor(chapter, sessionList.value!));
      this.isLoading = false;
    } else if (userInitiated && await app.core.dialog.errorAsync(true, series.error, sessionList.error)) {
      await this.refreshAsync();
    }
  }

  @mobx.action
  async repeatAsync() {
    await this.refreshAsync(false);
  }

  @mobx.computed
  get id() {
    return this._id;
  }

  @mobx.observable
  chapters!: app.ChapterViewModel[];

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

  private _viewModelFor(chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList) {
    const vm = this.chapters && this.chapters.find((vm) => chapter.id === vm.id);
    if (vm) return vm.refreshWith(chapter, checkIsSynchronizing(this._id, chapter, sessionList));
    return new app.ChapterViewModel(this._context, this, chapter, checkIsSynchronizing(this._id, chapter, sessionList));
  }
}

function checkIsSynchronizing(seriesId: string, chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList) {
  return sessionList.some((session) => !session.finishedAt
    && session.library
    && session.library.seriesId === seriesId
    && session.library.chapterId === chapter.id
    && session.library.sync)
}
