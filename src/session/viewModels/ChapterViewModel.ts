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
      const trackPromise = this._navigator && this._navigator.trackAsync ? this._navigator.trackAsync(this._pageCount, this._pageNumber) : undefined;
      const sessionPagePromise = this._loader.getAsync(this._pageNumber);
      const track = await trackPromise || {status: 200};
      const sessionPage = await sessionPagePromise;
      if (sessionPage.value && track.status === 200) {
        this.imageUrl = sessionPage.value;
      } else if (sessionPage.status === 404 || track.status === 404) {
        await app.core.screen.leaveAsync();
      } else {
        await app.core.dialog.errorAsync(sessionPage.error);
        await this.updateAsync();
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
}
