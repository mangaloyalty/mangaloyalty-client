import * as app from '..';
import * as areas from '../../areas';
import * as mobx from 'mobx';
import {language} from '../language';

export class ChapterViewModel {
  private readonly _context: app.ContextApi;
  private readonly _series: app.SeriesViewModel;
  private _ensureSynchronizeTo: number;

  constructor(context: app.ContextApi, series: app.SeriesViewModel) {
    this._context = context;
    this._series = series;
    this._ensureSynchronizeTo = 0;
  }

  @mobx.action
  async actionAsync() {
    if (this.isSynchronizing) {
      app.core.toast.add(language.libraryChapterActionBusy);
    } else if (this.syncAt) {
      if (await app.core.dialog.confirmDeleteAsync()) return;
      await this._deleteAsync();
    } else {
      await this._synchronizeAsync();
    }
  }
  
  @mobx.action
  async openAsync() {
    await app.core.screen.loadAsync(async () => {
      const session = await this._context.library.chapterReadAsync(this._series.id, this.id);
      if (session.value) {
        const restoreState = new app.SeriesRestoreState(this._series.showChapters);
        const pageNumber = this.pageReadNumber && Math.max(Math.min(this.pageReadNumber, session.value.pageCount), 1);
        const navigator = new app.Navigator(this._context, this._series.id, this._series.chapters, this._series.chapters.indexOf(this));
        const constructAsync = areas.session.ChapterController.createConstruct(session.value, this.title, navigator, pageNumber);
        if (await app.core.screen.openChildAsync(constructAsync, restoreState)) await this._series.refreshAsync();
      } else if (session.status === 404) {
        await this._series.refreshAsync();
      } else {
        await app.core.dialog.errorAsync(session.error);
        await this.openAsync();
      }
    });
  }

  @mobx.action
  refreshWith(chapter: app.ILibrarySeriesChapter, isSynchronizing: boolean) {
    this.id = chapter.id;
    this.isReadCompleted = chapter.isReadCompleted;
    this.isSynchronizing = isSynchronizing || (this._ensureSynchronizeTo >= Date.now());
    this.pageReadNumber = chapter.pageReadNumber;
    this.syncAt = chapter.syncAt;
    this.title = chapter.title;
    return this;
  }

  @mobx.action
  async toggleReadCompleted() {
    await app.core.screen.loadAsync(async () => {
      const response = await this._context.library.chapterPatchAsync(this._series.id, this.id, !this.isReadCompleted);
      if (response.status === 200) {
        this.isReadCompleted = !this.isReadCompleted;
      } else if (response.status === 404) {
        await this._series.refreshAsync();
      } else {
        await app.core.dialog.errorAsync(response.error);
        await this.toggleReadCompleted();
      }
    });
  }
  
  @mobx.observable
  id!: string;

  @mobx.observable
  isReadCompleted?: boolean;

  @mobx.observable
  isSynchronizing!: boolean;

  @mobx.observable
  pageReadNumber?: number;

  @mobx.observable
  syncAt?: number;

  @mobx.observable
  title!: string;

  private async _deleteAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await this._context.library.chapterDeleteAsync(this._series.id, this.id);
      if (response.status === 200) {
        await this._series.refreshAsync();
      } else if (response.status === 404) {
        await this._series.refreshAsync();
      } else {
        await app.core.dialog.errorAsync(response.error);
        await this._deleteAsync();
      }
    });
  }

  private async _synchronizeAsync() {
    await app.core.screen.loadAsync(async () => {
      const session = await this._context.library.chapterUpdateAsync(this._series.id, this.id);
      if (session.value) {
        this._ensureSynchronizeTo = Date.now() + app.settings.librarySeriesMinimumSynchronizingTimeout;
        this.isSynchronizing = true;
      } else if (session.status === 404) {
        await this._series.refreshAsync();
      } else {
        await app.core.dialog.errorAsync(session.error);
        await this._synchronizeAsync();
      }
    });
  }
}
