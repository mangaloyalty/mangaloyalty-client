import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class MainViewModel {
  private readonly _loader: app.Loader;
  private readonly _navigator: app.INavigator;
  private readonly _session: app.ISessionListItem;
  private readonly _title: string;
  private _imageNextTime?: number;
  private _imagePreviousTime?: number;
  private _pageNumber: number;

  constructor(navigator: app.INavigator, session: app.ISessionListItem, title: string, pageNumber?: number) {
    this._loader = new app.Loader(session);
    this._navigator = navigator;
    this._session = session;
    this._pageNumber = pageNumber || 1;
    this._title = title;
  }

  @mobx.action
  async chapterNextAsync() {
    await app.core.screen.loadAsync(async () => {
      if (!this._navigator.hasNext) {
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
      if (!this._navigator.hasPrevious) {
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
    } else if (this._pageNumber < this._session.pageCount) {
      this._pageNumber++;
      await this.updateAsync();
    } else if (!this._navigator.hasNext) {
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
    } else if (!this._navigator.hasPrevious) {
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
      const sessionPagePromise = this._loader.getAsync(this._pageNumber); 
      const trackPromise = this._navigator.trackAsync ? this._navigator.trackAsync(this._session.pageCount, this._pageNumber) : true;
      const sessionPage = await sessionPagePromise;
      if (sessionPage.value) {
        this.imageNode = sessionPage.value;
        // TODO: The tracking API call can take ~90-400ms, causing a spinner. Off-load this call?
        if (!await trackPromise) await app.core.dialog.errorAsync(() => this.updateAsync());
      } else if (sessionPage.status === 404) {
        await app.core.screen.leaveAsync();
      } else {
        await trackPromise;
        await app.core.dialog.errorAsync(() => this.updateAsync(), sessionPage.error);
      }
    });
  }

  @mobx.action
  async socketActionAsync(actions: app.ISocketAction[]) {
    if (checkActionLeave(actions, this._session.id)) {
      await app.core.screen.leaveAsync();
    }
  }

  @mobx.computed
  get title() {
    return this._title;
  }

  @mobx.observable
  imageNode!: HTMLImageElement;
  
  @mobx.observable
  showControls = false;
}

function checkActionLeave(actions: app.ISocketAction[], sessionId: string) {
  return actions.some((action) => {
    switch (action.type) {
      case 'SessionDelete': return action.session.id === sessionId;
      default: return false;
    }
  });
}
