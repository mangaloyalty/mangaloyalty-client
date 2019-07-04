import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

// TODO: Next/previous chapter handling (with toasts during transition windows).
// TODO: Error handling: should close the screen instead of disconnecting.
// TODO: Reading settings (LTR, RTL).

export class ChapterViewModel {
  private readonly _context: app.ContextApi;
  private readonly _loader: area.Loader;
  private readonly _session: app.ISessionListItem;
  private _pageNumber: number;

  constructor(pageNumber: number, session: app.ISessionListItem) {
    this._context = app.core.service.get('ContextApi');
    this._loader = new area.Loader(this._context, session);
    this._pageNumber = pageNumber;
    this._session = session;
    this.refreshAsync();
  }

  @mobx.action
  async navigateNextAsync() {
    if (this._pageNumber >= this._session.pageCount) return;
    this._pageNumber++;
    return await this.refreshAsync();
  }

  @mobx.action
  async navigatePreviousAsync() {
    if (this._pageNumber <= 1) return;
    this._pageNumber--;
    return await this.refreshAsync();
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    try {
      this.isLoading = true;
      const imageUrl = await this._loader.getImageUrlAsync(this._pageNumber);
      mobx.runInAction(() => {
        this.isHeaderVisible = false;
        this.isLoading = false;
        this.imageUrl = imageUrl;
      });
    } catch (error) {
      if (await app.core.dialog.errorAsync(error)) {
        this.refreshAsync(true);
      }
    }
  }

  @mobx.action
  toggleHeader() {
    this.isHeaderVisible = !this.isHeaderVisible;
  }

  @mobx.observable
  isHeaderVisible = false;

  @mobx.observable
  isLoading = false;

  @mobx.observable
  imageUrl?: string;
}
