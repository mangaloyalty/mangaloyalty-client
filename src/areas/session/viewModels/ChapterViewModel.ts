import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

// TODO: Reading settings (LTR, RTL).

export class ChapterViewModel {
  private readonly _context: app.ContextApi;
  private readonly _loader: area.Loader;
  private readonly _navigator?: app.INavigator;
  private readonly _session: app.ISessionListItem;
  private _pageNumber: number;

  constructor(session: app.ISessionListItem, navigator?: app.INavigator, pageNumber?: number) {
    this._context = app.core.service.get('ContextApi');
    this._loader = new area.Loader(this._context, session);
    this._navigator = navigator;
    this._pageNumber = pageNumber || 1;
    this._session = session;
    this.updateAsync();
  }

  // TODO: Chapter switch should have a confirmation toast, or a notification about end-is-reached.
  @mobx.action
  async chapterNextAsync() {
    if (this._navigator && this._navigator.hasNext) {
      this.isLoading = true;
      return await this._navigator.openNextAsync();
    }
  }

  // TODO: Chapter switch should have a confirmation toast, or a notification about end-is-reached.
  @mobx.action
  async chapterPreviousAsync() {
    if (this._navigator && this._navigator.hasPrevious) {
      this.isLoading = true;
      return await this._navigator.openPreviousAsync();
    }
  }

  @mobx.action
  async pageNextAsync() {
    if (this._pageNumber >= this._session.pageCount) return await this.chapterNextAsync();
    this._pageNumber++;
    return await this.updateAsync();
  }

  @mobx.action
  async pagePreviousAsync() {
    if (this._pageNumber <= 1) return await this.chapterPreviousAsync();
    this._pageNumber--;
    return await this.updateAsync();
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
