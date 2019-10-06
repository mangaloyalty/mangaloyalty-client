import * as app from '..';
import * as areas from '../../areas';
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesChapterViewModel {
  private readonly _series: app.SeriesViewModel;

  constructor(series: app.SeriesViewModel) {
    this._series = series;
  }

  @mobx.action
  async actionAsync() {
    if (this.isSynchronizing) {
      app.core.toast.add(language.libraryChapterActionBusy);
    } else if (this.syncAt) {
      if (await app.core.dialog.deleteAsync()) return;
      await this._deleteAsync();
    } else {
      await this._synchronizeAsync();
    }
  }
  
  @mobx.action
  async openAsync() {
    await app.core.screen.loadAsync(async () => {
      const session = await app.api.library.chapterReadAsync(this._series.id, this.id);
      if (session.value) {
        const restoreState = new app.SeriesRestoreState(this._series.showChapters);
        const pageNumber = this.pageReadNumber && this.pageReadNumber < session.value.pageCount && Math.max(Math.min(this.pageReadNumber, session.value.pageCount), 1);
        const navigator = new app.Navigator(this._series.id, this._series.chapters, this._series.chapters.indexOf(this));
        const constructAsync = areas.session.MainController.createConstruct(navigator, session.value, this.title, pageNumber || 1);
        await app.core.screen.openChildAsync(constructAsync, restoreState);
      } else if (session.status === 404) {
        return;
      } else {
        await app.core.dialog.errorAsync(() => this.openAsync(), session.error);
      }
    });
  }

  @mobx.action
  refreshWith(chapter: app.ILibrarySeriesChapter, isSynchronizing: boolean) {
    this.id = chapter.id;
    this.isReadCompleted = chapter.isReadCompleted;
    this.isSynchronizing = isSynchronizing;
    this.pageReadNumber = chapter.pageReadNumber;
    this.syncAt = chapter.syncAt;
    this.title = chapter.title;
    return this;
  }

  @mobx.action
  async toggleReadCompleted() {
    await app.core.screen.loadAsync(async () => {
      const pageReadNumber = this.isReadCompleted ? 1 : undefined;
      const response = await app.api.library.chapterPatchAsync(this._series.id, this.id, !this.isReadCompleted, pageReadNumber);
      if (response.status === 200 || response.status === 404) {
        return;
      } else {
        await app.core.dialog.errorAsync(() => this.toggleReadCompleted(), response.error);
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
      const response = await app.api.library.chapterDeleteAsync(this._series.id, this.id);
      if (response.status === 200 || response.status === 404) {
        return;
      } else {
        await app.core.dialog.errorAsync(() => this._deleteAsync(), response.error);
      }
    });
  }

  private async _synchronizeAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.api.library.chapterUpdateAsync(this._series.id, this.id);
      if (response.status === 200 || response.status === 404) {
        return;
      } else {
        await app.core.dialog.errorAsync(() => this._synchronizeAsync(), response.error);
      }
    });
  }
}
