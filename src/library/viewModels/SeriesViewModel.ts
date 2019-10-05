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
      const seriesPromise = app.api.library.seriesReadAsync(this.id);
      const sessionListPromise = app.api.session.listAsync(this.id);
      const series = await seriesPromise;
      const sessionList = await sessionListPromise;
      if (series.value && sessionList.value) {
        this.image = series.value.source.image;
        this.summary = series.value.source.summary;
        this.title = series.value.source.title;
        this.automation = (this.automation || new app.SeriesAutomationViewModel(this)).refreshWith(series.value);
        this.chapters = series.value.chapters.map((chapter) => this._viewModelFor(chapter, sessionList.value!));
      } else if (series.status === 404) {
        await app.core.screen.leaveAsync();
      } else {
        await app.core.dialog.errorAsync(() => this.refreshAsync(), series.error, sessionList.error);
      }
    });
  }

  @mobx.action
  async updateAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.api.library.seriesUpdateAsync(this.id);
      if (response.status === 200 || response.status === 404) {
        return;
      } else {
        await app.core.dialog.errorAsync(() => this.updateAsync(), response.error);
      }
    });
  }

  @mobx.action
  async socketActionAsync(actions: app.ISocketAction[]) {
    if (checkActionLeave(this.id, actions)) {
      await app.core.screen.leaveAsync();
    } else if (checkActionRefresh(this.id,actions)) {
      await this.refreshAsync();
    }
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
    await app.core.screen.loadAsync(async () => {
      const response = await app.api.library.seriesDeleteAsync(this.id);
      if (response.status === 200 || response.status === 404) {
        return;
      } else {
        await app.core.dialog.errorAsync(() => this._deleteAsync(), response.error);
      }
    });
  }

  private _viewModelFor(chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList) {
    const isSynchronizing = checkSynchronizing(this.id, chapter, sessionList);
    const vm = this.chapters && this.chapters.find((vm) => chapter.id === vm.id) || new app.SeriesChapterViewModel(this);
    return vm.refreshWith(chapter, isSynchronizing);
  }
}

function checkActionLeave(seriesId: string, actions: app.ISocketAction[]) {
  return actions.some((action) => {
    switch (action.type) {
      case 'SeriesDelete': return action.seriesId === seriesId;
      default: return false;
    }
  });
}

function checkActionRefresh(seriesId: string, actions: app.ISocketAction[]) {
  return actions.some((action) => {
    switch (action.type) {
      case 'SocketConnect': return true;
      case 'SeriesPatch'  : return action.seriesId === seriesId;
      case 'SeriesUpdate' : return action.seriesId === seriesId;
      case 'ChapterDelete': return action.seriesId === seriesId;
      case 'ChapterPatch' : return action.seriesId === seriesId;
      case 'ChapterUpdate': return action.seriesId === seriesId;
      case 'SessionCreate': return action.session.library && action.session.library.seriesId === seriesId && action.session.library.sync;
      default: return false;
    }
  });
}

function checkSynchronizing(seriesId: string, chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList) {
  return sessionList.some((session) => !session.finishedAt
    && session.library
    && session.library.seriesId === seriesId
    && session.library.chapterId === chapter.id
    && session.library.sync)
}
