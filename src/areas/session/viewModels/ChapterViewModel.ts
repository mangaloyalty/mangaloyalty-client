import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class ChapterViewModel {
  private readonly _context: app.ContextApi;
  private readonly _loader: area.Loader;
  private readonly _navigator?: app.INavigator;
  private readonly _pageCount: number;
  private _imageNextTime?: number;
  private _imagePreviousTime?: number;
  private _pageNumber: number;

  constructor(session: app.ISessionListItem, navigator?: app.INavigator, pageNumber?: number) {
    this._context = app.core.service.get(app.settings.contextKey);
    this._loader = new area.Loader(this._context, session);
    this._navigator = navigator;
    this._pageCount = session.pageCount;
    this._pageNumber = pageNumber || 1;
    this.updateAsync();
  }

  @mobx.action
  async chapterNextAsync() {
    if (!this._navigator || !this._navigator.hasNext) {
      app.core.toast.add(app.language.sessionToastNextUnavailable);
    } else {
      this.isLoading = true;
      app.core.toast.add(app.language.sessionToastNextActive);
      await this._navigator.openNextAsync();
    }
  }

  @mobx.action
  async chapterPreviousAsync() {
    if (!this._navigator || !this._navigator.hasPrevious) {
      app.core.toast.add(app.language.sessionToastPreviousUnavailable);
    } else {
      this.isLoading = true;
      app.core.toast.add(app.language.sessionToastPreviousActive);
      await this._navigator.openPreviousAsync();
    }
  }

  @mobx.action
  async pressNextAsync() {
    if (this.showControls) {
      this.showControls = false;
    } else if (this._pageNumber < this._pageCount) {
      this._pageNumber++;
      await this.updateAsync();
    } else if (!this._navigator || !this._navigator.hasNext) {
      app.core.toast.add(app.language.sessionToastNextUnavailable);
    } else if (!this._imageNextTime || this._imageNextTime < Date.now()) {
      app.core.toast.add(app.language.sessionToastNextRepeat);
      this._imageNextTime = Date.now() + app.settings.toastTimeout;
    } else {
      await this.chapterNextAsync();
    }
  }

  @mobx.action
  async pressPreviousAsync() {
    if (this.showControls) {
      this.showControls = false;
    } else if (this._pageNumber > 1) {
      this._pageNumber--;
      await this.updateAsync();
    } else if (!this._navigator || !this._navigator.hasPrevious) {
      app.core.toast.add(app.language.sessionToastPreviousUnavailable);
    } else if (!this._imagePreviousTime || this._imagePreviousTime < Date.now()) {
      app.core.toast.add(app.language.sessionToastPreviousRepeat);
      this._imagePreviousTime = Date.now() + app.settings.toastTimeout;
    } else {
      await this.chapterPreviousAsync();
    }
  }

  @mobx.action
  toggleControls() {
    this.showControls = !this.showControls;
  }

  // TODO: If the previous status promise is still resolving, DON'T run this update?!
  @mobx.action
  async updateAsync() {
    try {
      this.isLoading = true;
      const imagePromise = this._updateImageAsync();
      const statusPromise = this._updateStatusAsync();
      await imagePromise;
      mobx.runInAction(() => this.isLoading = false);
      await statusPromise;
    } catch (error) {
      if (await app.core.dialog.errorAsync(true, error)) {
        await this.updateAsync();
      }
    }
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  imageUrl?: string;
  
  @mobx.observable
  showControls = false;

  private async _updateImageAsync() {
    const imageUrl = await this._loader.getImageUrlAsync(this._pageNumber);
    mobx.runInAction(() => this.imageUrl = imageUrl);
  }

  private async _updateStatusAsync() {
    if (!this._navigator || !this._navigator.statusAsync) return;
    await this._navigator.statusAsync(this._pageCount, this._pageNumber);
  }
}
