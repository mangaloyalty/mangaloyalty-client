import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesListViewModel {
  private readonly _series: app.SeriesViewModel;

  constructor(series: app.SeriesViewModel) {
    this._series = series;
  }

  @mobx.action
  async actionAsync() {
    if (this.selectionItems.length <= 1) {
      await Promise.all(this.selectionItems.filter((chapter) => !chapter.isSynchronizing).map((chapter) => chapter.actionAsync()));
    } else if (this.isSelectionSynchronizing) {
      app.core.toast.add(language.libraryChapterActionBusy);
    } else if (this.isSelectionSynchronized) {
      if (await app.core.dialog.confirmAsync(language.libraryConfirmDeleteAll)) return;
      await this._deleteAsync();
    } else {
      if (await app.core.dialog.confirmAsync(language.libraryConfirmSynchronizeAll)) return;
      await this._synchronizeAsync();
    }
  }

  @mobx.action
  async toggleReadCompletedAsync() {
    await app.core.screen.loadAsync(async () => {
      const items = this.selectionItems.filter((chapter) => this.isSelectionReadCompleted ? chapter.isReadCompleted : !chapter.isReadCompleted);
      const responses = await Promise.all(items.map((chapter) => app.core.context.library.chapterPatchAsync(this._series.id, chapter.id, !chapter.isReadCompleted, chapter.isReadCompleted ? 1 : undefined)));
      const fault = responses.find((response) => response.status !== 200 && response.status !== 404);
      if (fault) await app.core.dialog.errorAsync(() => this.toggleReadCompletedAsync(), fault.error);
    });
  }
  
  @mobx.action
  changeSelectionMode(selectionMode: SeriesListViewModel['selectionMode']) {
    switch (selectionMode) {
      case 'none':
        this.items.forEach((chapter) => chapter.setChecked(false));
        break;
      case 'all':
        this.items.forEach((chapter) => chapter.setChecked(true));
        break;
      case 'unread':
        this.items.forEach((chapter) => chapter.setChecked(!Boolean(chapter.isReadCompleted)));
        break;
      case 'read':
        this.items.forEach((chapter) => chapter.setChecked(Boolean(chapter.isReadCompleted)));
        break;
    }
  }
  
  @mobx.action
  refreshWith(series: app.ILibrarySeries, sessionList: app.ISessionList) {
    this.items = series.chapters.map((chapter) => this._viewModelFor(chapter, sessionList));
    return this;
  }
  
  @mobx.computed
  get canSelectAll() {
    return Boolean(this.items.length);
  }

  @mobx.computed
  get canSelectRead() {
    const items = this.items.filter((chapter) => chapter.isReadCompleted);
    return items.length > 0 && items.length < this.items.length;
  }

  @mobx.computed
  get canSelectUnread() {
    const items = this.items.filter((chapter) => !chapter.isReadCompleted);
    return items.length > 0 && items.length < this.items.length;
  }

  @mobx.computed
  get isSelectionReadCompleted() {
    return this.selectionItems.every((chapter) => chapter.isReadCompleted);
  }

  @mobx.computed
  get isSelectionSynchronized() {
    return this.selectionItems.every((chapter) => chapter.syncAt);
  }

  @mobx.computed
  get isSelectionSynchronizing() {
    return this.selectionItems.every((chapter) => chapter.syncAt || chapter.isSynchronizing) && !this.isSelectionSynchronized;
  }
  
  @mobx.computed
  get selectionItems() {
    return this.items.filter((chapter) => chapter.isChecked);
  }

  @mobx.computed
  get selectionMode() {
    if (this.items.every((chapter) => !chapter.isChecked)) {
      return 'none';
    } else if (this.items.every((chapter) => chapter.isChecked)) {
      return 'all';
    } else if (this.items.every((chapter) => chapter.isChecked || !chapter.isReadCompleted) && this.items.every((chapter) => !chapter.isChecked || chapter.isReadCompleted)) {
      return 'read';
    } else if (this.items.every((chapter) => chapter.isChecked || chapter.isReadCompleted) && this.items.every((chapter) => !chapter.isChecked || !chapter.isReadCompleted)) {
      return 'unread';
    } else {
      return 'custom';
    }
  }

  @mobx.computed
  get showControls() {
    return this.selectionMode !== 'none';
  }

  @mobx.computed
  get unreadCount() {
    return this.items.filter((chapter) => !chapter.isReadCompleted).length;
  }

  @mobx.observable
  items!: app.SeriesListItemViewModel[];

  private async _deleteAsync() {
    await app.core.screen.loadAsync(async () => {
      const items = this.selectionItems.filter((chapter) => chapter.syncAt);
      const responses = await Promise.all(items.map((chapter) => app.core.context.library.chapterDeleteAsync(this._series.id, chapter.id)));
      const fault = responses.find((response) => response.status !== 200 && response.status !== 404);
      if (fault) await app.core.dialog.errorAsync(() => this._deleteAsync(), fault.error);
    });
  }

  private async _synchronizeAsync() {
    await app.core.screen.loadAsync(async () => {
      const items = this.selectionItems.filter((chapter) => !chapter.syncAt && !chapter.isSynchronizing);
      const responses = await Promise.all(items.map((chapter) => app.core.context.library.chapterUpdateAsync(this._series.id, chapter.id)));
      const fault = responses.find((response) => response.status !== 200 && response.status !== 404);
      if (fault) await app.core.dialog.errorAsync(() => this._synchronizeAsync(), fault.error);
    });
  }

  private _viewModelFor(chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList) {
    const isSynchronizing = checkSynchronizing(chapter, sessionList, this._series.id);
    const vm = this.items && this.items.find((vm) => chapter.id === vm.id) || new app.SeriesListItemViewModel(this._series);
    return vm.refreshWith(chapter, isSynchronizing);
  }
}

function checkSynchronizing(chapter: app.ILibrarySeriesChapter, sessionList: app.ISessionList, seriesId: string) {
  return sessionList.some((session) => !session.finishedAt
    && session.library
    && session.library.seriesId === seriesId
    && session.library.chapterId === chapter.id
    && session.library.sync)
}
