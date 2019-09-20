import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class ChapterViewModel {
  private readonly _context = app.core.service.get<app.ContextApi>(app.settings.contextKey);
  private readonly _loader: app.Loader;
  private readonly _navigator?: app.INavigator;
  private readonly _pageCount: number;
  private readonly _title: string;
  private _imageNextTime?: number;
  private _imagePreviousTime?: number;
  private _pageNumber: number;

  constructor(session: app.ISessionListItem, title: string, navigator?: app.INavigator, pageNumber?: number) {
    this._loader = new app.Loader(this._context, session);
    this._navigator = navigator;
    this._pageCount = session.pageCount;
    this._pageNumber = pageNumber || 1;
    this._title = title;
  }

  @mobx.action
  async chapterNextAsync() {
    await app.core.screen.loadAsync(async () => {
      if (!this._navigator || !this._navigator.hasNext) {
        app.core.toast.add(language.sessionToastNextUnavailable);
      } else {
        app.core.toast.add(language.sessionToastNextActive);
        await this._navigator.openNextAsync();
      }
    });
  }

  @mobx.action
  async chapterPreviousAsync() {
    await app.core.screen.loadAsync(async () => {
      if (!this._navigator || !this._navigator.hasPrevious) {
        app.core.toast.add(language.sessionToastPreviousUnavailable);
      } else {
        app.core.toast.add(language.sessionToastPreviousActive);
        await this._navigator.openPreviousAsync();
      }
    });
  }

  @mobx.action
  async pressNextAsync() {
    if (this.showControls) {
      this.showControls = false;
    } else if (this._pageNumber < this._pageCount) {
      this._pageNumber++;
      await this.updateAsync();
    } else if (!this._navigator || !this._navigator.hasNext) {
      app.core.toast.add(language.sessionToastNextUnavailable);
    } else if (!this._imageNextTime || this._imageNextTime < Date.now()) {
      app.core.toast.add(language.sessionToastNextRepeat);
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
      app.core.toast.add(language.sessionToastPreviousUnavailable);
    } else if (!this._imagePreviousTime || this._imagePreviousTime < Date.now()) {
      app.core.toast.add(language.sessionToastPreviousRepeat);
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
  async updateAsync() {
    await app.core.screen.loadAsync(async () => {
      try {
        const imagePromise = this._updateImageAsync();
        const statusPromise = this._updateStatusAsync();
        await imagePromise;
        await statusPromise;
      } catch (error) {
        if (await app.core.dialog.errorAsync(true, error)) {
          await this.updateAsync();
        }
      }
    });
  }

  @mobx.computed
  get showNavigator() {
    return Boolean(this._navigator);
  }

  @mobx.computed
  get title() {
    return this._title;
  }

  @mobx.observable
  imageUrl!: string;
  
  @mobx.observable
  showControls = false;

  private async _updateImageAsync() {
    const imageUrl = await this._loader.getImageUrlAsync(this._pageNumber);
    this.imageUrl = imageUrl;
  }

  private async _updateStatusAsync() {
    if (!this._navigator || !this._navigator.statusAsync) return;
    await this._navigator.statusAsync(this._pageCount, this._pageNumber);
  }
}
