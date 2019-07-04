import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

// TODO: Next/previous chapter handling (with toasts during transition windows).
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
    this.updateAsync();
  }

  @mobx.action
  async pageNextAsync() {
    if (this._pageNumber >= this._session.pageCount) return;
    this._pageNumber++;
    return await this.updateAsync();
  }

  @mobx.action
  async pagePreviousAsync() {
    if (this._pageNumber <= 1) return;
    this._pageNumber--;
    return await this.updateAsync();
  }

  @mobx.action
  toggleControls() {
    this.showControls = !this.showControls;
  }

  @mobx.action
  async updateAsync() {
    try {
      this.isLoading = true;
      const imageUrl = await this._loader.getImageUrlAsync(this._pageNumber);
      mobx.runInAction(() => {
        this.isLoading = false;
        this.imageUrl = imageUrl;
        this.showControls = false;
      });
    } catch (error) {
      if (await app.core.dialog.errorAsync(error)) {
        this.updateAsync();
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
