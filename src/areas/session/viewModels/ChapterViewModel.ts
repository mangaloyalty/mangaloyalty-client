import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

// TODO: Reading settings (LTR, RTL).

export class ChapterViewModel {
  private readonly _context: app.ContextApi;
  private readonly _loader: area.Loader;
  private readonly _navigator?: app.INavigator;
  private readonly _session: app.ISessionListItem;
  private _imageNextTime?: number;
  private _imagePreviousTime?: number;
  private _pageNumber: number;

  constructor(session: app.ISessionListItem, navigator?: app.INavigator, pageNumber?: number) {
    this._context = app.core.service.get(app.settings.contextKey);
    this._loader = new area.Loader(this._context, session);
    this._navigator = navigator;
    this._pageNumber = pageNumber || 1;
    this._session = session;
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
  async imageNextAsync() {
    if (this._pageNumber < this._session.pageCount) {
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
  async imagePreviousAsync() {
    if (this._pageNumber > 1) {
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

  @mobx.action
  async updateAsync(forceRefresh?: boolean) {
    try {
      if (!forceRefresh && this.isLoading) return;
      this.isLoading = true;
      const imageUrl = await this._loader.getImageUrlAsync(this._pageNumber);
      mobx.runInAction(() => {
        this.isLoading = false;
        this.imageUrl = imageUrl;
        this.showControls = false;
      });
    } catch (error) {
      if (await app.core.dialog.errorAsync(error)) {
        await this.updateAsync(true);
      }
    }
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  imageUrl?: string;
  
  @mobx.observable
  showControls = false;
}
