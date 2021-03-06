import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesViewModel {
  constructor(seriesId: string, showAutomation?: boolean, restoreState?: app.SeriesRestoreState) {
    this.id = seriesId;
    this.automation = new app.SeriesAutomationViewModel(restoreState ? restoreState.showAutomation : showAutomation);
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
    await app.core.context.library.seriesDumpAsync(this.id);
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const seriesPromise = app.core.context.library.seriesReadAsync(this.id);
      const sessionListPromise = app.core.context.session.listAsync(this.id);
      const series = await seriesPromise;
      const sessionList = await sessionListPromise;
      if (series.value && sessionList.value) {
        this.addedAt = formatEpoch(series.value.addedAt);
        this.automation = this.automation.refreshWith(series.value);
        this.chapters = this.chapters.refreshWith(series.value, sessionList.value);
        this.lastChapterAddedAt = formatEpoch(series.value.lastChapterAddedAt);
        this.lastPageReadAt = formatEpoch(series.value.lastPageReadAt);
        this.lastSyncAt = formatEpoch(series.value.lastSyncAt);
        this.source = series.value.source;
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
      const response = await app.core.context.library.seriesUpdateAsync(this.id);
      if (response.status !== 200 && response.status !== 404) await app.core.dialog.errorAsync(() => this.updateAsync(), response.error);
    });
  }

  @mobx.action
  async socketActionAsync(actionList: app.IClientActionList) {
    if (checkActionLeave(actionList, this.id)) {
      await app.core.screen.leaveAsync();
    } else if (checkActionRefresh(actionList, this.id)) {
      await this.refreshAsync();
    }
  }

  @mobx.observable
  addedAt!: string;

  @mobx.observable
  automation: app.SeriesAutomationViewModel;

  @mobx.observable
  chapters: app.SeriesListViewModel;

  @mobx.observable
  id: string;

  @mobx.observable
  lastChapterAddedAt!: string;

  @mobx.observable
  lastPageReadAt!: string;

  @mobx.observable
  lastSyncAt!: string;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  source!: app.ILibrarySeriesSource;

  private async _deleteAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.core.context.library.seriesDeleteAsync(this.id);
      if (response.status !== 200 && response.status !== 404)  await app.core.dialog.errorAsync(() => this._deleteAsync(), response.error);
    });
  }
}

function checkActionLeave(actionList: app.IClientActionList, seriesId: string) {
  return actionList.some((action) => {
    switch (action.type) {
      case 'SeriesDelete': return action.seriesId === seriesId;
      default: return false;
    }
  });
}

function checkActionRefresh(actionList: app.IClientActionList, seriesId: string) {
  return actionList.some((action) => {
    switch (action.type) {
      case 'SocketConnect': return true;
      case 'SeriesPatch'  : return action.seriesId === seriesId;
      case 'SeriesUpdate' : return action.seriesId === seriesId;
      case 'ChapterDelete': return action.seriesId === seriesId;
      case 'ChapterPatch' : return action.seriesId === seriesId;
      case 'SessionCreate': return action.seriesId === seriesId && action.sync;
      case 'SessionUpdate': return action.seriesId === seriesId && action.sync;
      default: return false;
    }
  });
}

function formatEpoch(epoch?: number) {
  if (!epoch) return '-';
  const locale = 'en-GB';
  const options = {day: '2-digit', month: 'short', year: 'numeric', hour12: false, hour: '2-digit', minute: '2-digit'};
  return new Date(epoch).toLocaleString(locale, options);
}
