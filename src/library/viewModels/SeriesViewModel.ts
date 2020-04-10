import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesViewModel {
  constructor(seriesId: string, showAutomation?: boolean, restoreState?: app.SeriesRestoreState) {
    this.id = seriesId;
    this.automation = new app.SeriesAutomationViewModel(showAutomation);
    this.chapters = new app.SeriesListViewModel(this);
    this.showChapters = restoreState ? restoreState.showChapters : this.showChapters;
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
    scrollTo(0, 0);
  }

  @mobx.action
  async deleteAsync() {
    if (await app.core.dialog.confirmAsync(language.libraryConfirmDelete)) return;
    await this._deleteAsync();
  }

  @mobx.action
  async dumpAsync() {
    if (await app.core.dialog.confirmAsync(language.libraryConfirmDump)) return;
    window.location.href = app.api.library.seriesDumpUrl(this.id);
  }

  @mobx.action
  async imageDataAsync() {
    if (this.imageData) return true;
    return await app.core.screen.loadAsync(async () => {
      const seriesImage = await app.api.library.seriesImageAsync(this.id);
      if (seriesImage.value) {
        this.imageData = seriesImage.value;
        return true;
      } else {
        return false;
      }
    });
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const imageDataPromise = this.imageDataAsync();
      const seriesPromise = app.api.library.seriesReadAsync(this.id);
      const sessionListPromise = app.api.session.listAsync(this.id);
      const imageData = await imageDataPromise;
      const series = await seriesPromise;
      const sessionList = await sessionListPromise;
      if (imageData && series.value && sessionList.value) {
        this.summary = series.value.source.summary;
        this.title = series.value.source.title;
        this.url = series.value.source.url;
        this.automation = this.automation.refreshWith(series.value);
        this.chapters = this.chapters.refreshWith(series.value, sessionList.value);
      } else if (series.status === 404) {
        await app.core.screen.leaveAsync();
      } else {
        await app.core.dialog.errorAsync(() => this.refreshAsync(), series.error, sessionList.error);
      }
    });
  }

  @mobx.action
  async startAsync() {
    for (let i = this.chapters.items.length - 1; i >= 0; i--) {
      if (!this.chapters.items[i].isReadCompleted) {
        return await this.chapters.items[i].openAsync();
      } else if (i === 0) {
        app.core.toast.add(language.librarySeriesToastQuickRead);
      }
    }
  }

  @mobx.action
  async updateAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.api.library.seriesUpdateAsync(this.id);
      if (response.status !== 200 && response.status !== 404) await app.core.dialog.errorAsync(() => this.updateAsync(), response.error);
    });
  }

  @mobx.action
  async socketActionAsync(actions: app.ISocketAction[]) {
    if (checkActionLeave(actions, this.id)) {
      await app.core.screen.leaveAsync();
    } else if (checkActionRefresh(actions, this.id)) {
      await this.refreshAsync();
    }
  }

  @mobx.observable
  automation: app.SeriesAutomationViewModel;

  @mobx.observable
  chapters: app.SeriesListViewModel;

  @mobx.observable
  id: string;

  @mobx.observable
  imageData!: string;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  summary?: string;

  @mobx.observable
  title!: string;

  @mobx.observable
  url!: string;

  private async _deleteAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.api.library.seriesDeleteAsync(this.id);
      if (response.status !== 200 && response.status !== 404)  await app.core.dialog.errorAsync(() => this._deleteAsync(), response.error);
    });
  }
}

function checkActionLeave(actions: app.ISocketAction[], seriesId: string) {
  return actions.some((action) => {
    switch (action.type) {
      case 'SeriesDelete': return action.seriesId === seriesId;
      default: return false;
    }
  });
}

function checkActionRefresh(actions: app.ISocketAction[], seriesId: string) {
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
