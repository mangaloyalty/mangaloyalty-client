import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesViewModel {
  constructor(id: string, restoreState?: app.SeriesRestoreState) {
    this.id = id;
    this.showChapters = restoreState ? restoreState.showChapters : this.showChapters;
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
    scrollTo(0, 0);
  }

  @mobx.action
  async deleteAsync() {
    if (await app.core.dialog.deleteAsync()) return;
    await app.core.screen.loadAsync(() => this._deleteAsync());
  }

  @mobx.action
  async intervalAsync() {
    await this._refreshAsync({providerUpdate: false, showDialog: false});
  }

  @mobx.action
  async readAsync() {
    for (let i = this.chapters.length - 1; i >= 0; i--) if (!this.chapters[i].isReadCompleted) return await this.chapters[i].openAsync();
    app.core.toast.add(language.librarySeriesToastQuickRead);
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(() => this._refreshAsync({providerUpdate: false, showDialog: true}));
  }

  @mobx.action
  async updateAsync() {
    await app.core.screen.loadAsync(() => this._refreshAsync({providerUpdate: true, showDialog: true}));
  }

  @mobx.observable
  automation!: app.SeriesAutomationViewModel;

  @mobx.observable
  chapters!: app.SeriesChapterViewModel[];

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
    const response = await app.api.library.seriesDeleteAsync(this.id);
    if (response.status === 200) {
      await app.core.screen.leaveAsync();
    } else if (response.status === 404) {
      await app.core.screen.leaveAsync();
    } else {
      await app.core.dialog.errorAsync(() => this._deleteAsync(), response.error);
    }
  }

  private async _refreshAsync(options: {providerUpdate: boolean, showDialog: boolean}) {
    const seriesPromise = options.providerUpdate ? app.api.library.seriesUpdateAsync(this.id) : app.api.library.seriesReadAsync(this.id);
    const sessionListPromise = app.api.session.listAsync(this.id);
    const series = await seriesPromise;
    const sessionList = await sessionListPromise;
    if (series.value && sessionList.value) {
      this.image = series.value.source.image;
      this.summary = series.value.source.summary;
      this.title = series.value.source.title;
      this.automation = (this.automation || new app.SeriesAutomationViewModel(this)).refreshWith(series.value);
      this.chapters = series.value.chapters.map((chapter) => this._viewModelFor(chapter, sessionList.value!));
    } else if (!options.showDialog) {
      return;
    } else if (series.status === 404) {
      await app.core.screen.leaveAsync();
    } else {
      await app.core.dialog.errorAsync(() => this.refreshAsync(), series.error, sessionList.error);
    }
  }

  private _viewModelFor(chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList) {
    const isSynchronizing = checkIsSynchronizing(this.id, chapter, sessionList);
    const vm = this.chapters && this.chapters.find((vm) => chapter.id === vm.id) || new app.SeriesChapterViewModel(this);
    return vm.refreshWith(chapter, isSynchronizing);
  }
}

function checkIsSynchronizing(seriesId: string, chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList) {
  return sessionList.some((session) => !session.finishedAt
    && session.library
    && session.library.seriesId === seriesId
    && session.library.chapterId === chapter.id
    && session.library.sync)
}
