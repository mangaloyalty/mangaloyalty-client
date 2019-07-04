import * as app from '../../..';
import * as area from '..';

export class Loader {
  private readonly _cache: {[pageNumber: number]: Promise<string>};
  private readonly _context: app.ContextApi;
  private readonly _session: app.ISessionListItem;

  constructor(context: app.ContextApi, session: app.ISessionListItem) {
    this._cache = {};
    this._context = context;
    this._session = session;
  }

  async getImageUrlAsync(pageNumber: number) {
    this._expire(pageNumber);
    this._load(pageNumber);
    return await this._cache[pageNumber];
  }

  private _expire(pageNumber: number) {
    const minimumPreserve = pageNumber - app.settings.sessionPreloadRange;
    const maximumPreserve = pageNumber + app.settings.sessionPreloadRange;
    for (let i = 1; i < this._session.pageCount; i++) {
      if (i >= minimumPreserve && i <= maximumPreserve) continue;
      delete this._cache[i];
    }
  }

  private _load(pageNumber: number) {
    for (let i = pageNumber - app.settings.sessionPreloadRange; i <= pageNumber + app.settings.sessionPreloadRange; i++) {
      if (i < 1 || i > this._session.pageCount) continue;
      this._cache[i] = this._cache[i] || this._pageAsync(i);
    }
  }
  
  private async _pageAsync(pageNumber: number) {
    const response = await this._context.sessionPage(this._session.id, pageNumber);
    if (!response.result) throw response.error;
    return area.fanfoxProvider.isSupported(this._session.url)
      ? await area.fanfoxProvider.processAsync(response.result.image)
      : `data:;base64, ${response.result.image}`;
  }
}
