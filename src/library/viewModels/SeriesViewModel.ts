import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesViewModel {
  private readonly _context = app.core.service.get<app.ContextApi>(app.settings.contextKey);

  constructor(id: string, restoreState?: app.SeriesRestoreState) {
    this.id = id;
    this.showChapters = restoreState ? restoreState.showChapters : this.showChapters;
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
  }

  @mobx.action
  async deleteAsync() {
    if (await app.core.dialog.confirmDeleteAsync()) return;
    await this._deleteAsync();
  }

  @mobx.action
  async readAsync() {
    for (let i = this.chapters.length - 1; i >= 0; i--) if (!this.chapters[i].isReadCompleted) return await this.chapters[i].openAsync();
    app.core.toast.add(language.librarySeriesToastQuickRead);
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      await this._refreshAsync({
        providerUpdate: false,
        userInitiated: true
      });
    });
  }

  @mobx.action
  async repeatAsync() {
    await this._refreshAsync({
      providerUpdate: false,
      userInitiated: false
    });
  }

  @mobx.action
  async updateAsync() {
    await app.core.screen.loadAsync(async () => {
      await this._refreshAsync({
        providerUpdate: true,
        userInitiated: true
      });
    });
  }

  @mobx.observable
  chapters!: app.ChapterViewModel[];

  @mobx.observable
  id: string;

  @mobx.observable
  image!: string;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  summary?: string;

  @mobx.observable
  title!: string;

  private async _deleteAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await this._context.library.seriesDeleteAsync(this.id);
      if (response.status === 200) {
        await app.core.screen.leaveAsync();
      } else if (await app.core.dialog.errorAsync(true, response.error)) {
        await this._deleteAsync();
      }
    });
  }

  private async _refreshAsync(options: {providerUpdate: boolean, userInitiated: boolean}) {
    const seriesPromise = options.providerUpdate ? this._context.library.seriesUpdateAsync(this.id) : this._context.library.seriesReadAsync(this.id);
    const sessionListPromise = this._context.session.listAsync(this.id);
    const series = await seriesPromise;
    const sessionList = await sessionListPromise;
    if (series.value && sessionList.value) {
      this.image = series.value.source.image;
      this.summary = series.value.source.summary;
      this.title = series.value.source.title;
      this.chapters = series.value.chapters.map((chapter) => this._viewModelFor(chapter, sessionList.value!));
    } else if (options.userInitiated && await app.core.dialog.errorAsync(true, series.error, sessionList.error)) {
      await this.refreshAsync();
    }
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
