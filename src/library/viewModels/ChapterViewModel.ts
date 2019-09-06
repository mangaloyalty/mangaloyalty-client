import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class ChapterViewModel {
  private readonly _context: app.ContextApi;
  private readonly _series: app.SeriesViewModel;
  private _ensureSynchronizeTo: number;

  constructor(context: app.ContextApi, series: app.SeriesViewModel, chapter: app.ILibrarySeriesChapter, isSynchronizing: boolean) {
    this._context = context;
    this._series = series;
    this._ensureSynchronizeTo = 0;
    this._updateWith(chapter, isSynchronizing);
  }

  @mobx.action
  async actionAsync() {
    if (this.isSynchronizing) {
      app.core.toast.add(language.librarySeriesActionBusy);
    } else if (this.syncAt) {
      if (await app.core.dialog.deleteAsync()) return;
      await this._deleteAsync();
    } else {
      await this._synchronizeAsync();
    }
  }
  
  @mobx.action
  async openAsync() {
    this._series.isLoading = true;
    await new app.Navigator(this._context, this._series.id, this._series.chapters, this._series.chapters.indexOf(this)).openCurrentAsync();
    this._series.isLoading = false;
  }

  @mobx.action
  refreshWith(chapter: app.ILibrarySeriesChapter, isSynchronizing: boolean) {
    this._updateWith(chapter, isSynchronizing);
    return this;
  }

  @mobx.action
  async statusAsync(isReadCompleted?: boolean, pageReadNumber?: number) {
    this.isLoading = true;
    const response = await this._context.library.chapterPatchAsync(this._series.id, this.id, isReadCompleted, pageReadNumber);
    if (response.status === 200) {
      this.isReadCompleted = this.isReadCompleted || isReadCompleted;
      this.pageReadNumber = pageReadNumber;
      this.isLoading = false;
    } else if (await app.core.dialog.errorAsync(true, response.error)) {
      await this.statusAsync(isReadCompleted, pageReadNumber);
    }
  }

  @mobx.action
  async toggleReadCompleted() {
    this.isLoading = true;
    const response = await this._context.library.chapterPatchAsync(this._series.id, this.id, !this.isReadCompleted);
    if (response.status === 200) {
      this.isReadCompleted = !this.isReadCompleted;
      this.isLoading = false;
    } else if (await app.core.dialog.errorAsync(true)) {
      await this.toggleReadCompleted();
    }
  }

  @mobx.observable
  id!: string;

  @mobx.observable
  isLoading = false;

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

  // TODO: When the server deletes me because I don't exist any longer, hide from the UI, too!
  private async _deleteAsync() {
    this.isLoading = true;
    const response = await this._context.library.chapterDeleteAsync(this._series.id, this.id);
    if (response.status === 200) {
      this.syncAt = undefined;
      this.isLoading = false;
    } else if (await app.core.dialog.errorAsync(true, response.error)) {
      await this._deleteAsync();
    }
  }

  private async _synchronizeAsync() {
    this.isLoading = true;
    const session = await this._context.library.chapterUpdateAsync(this._series.id, this.id);
    if (session.value) {
      this._ensureSynchronizeTo = Date.now() + app.settings.librarySeriesMinimumSynchronizingTimeout;
      this.isSynchronizing = true;
      this.isLoading = false;
    } else if (await app.core.dialog.errorAsync(true, session.error)) {
      await this._synchronizeAsync();
    }
  }

  private _updateWith(chapter: app.ILibrarySeriesChapter, isSynchronizing: boolean) {
    this.id = chapter.id;
    this.isReadCompleted = chapter.isReadCompleted;
    this.isSynchronizing = isSynchronizing || (this._ensureSynchronizeTo >= Date.now());
    this.pageReadNumber = chapter.pageReadNumber;
    this.syncAt = chapter.syncAt;
    this.title = chapter.title;
  }
}
