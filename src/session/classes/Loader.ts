import * as app from '..';

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
    const minimum = pageNumber - app.settings.sessionLoadRange;
    const maximum = pageNumber + app.settings.sessionLoadRange;
    for (let i = 1; i < this._session.pageCount; i++) {
      if (i >= minimum && i <= maximum) continue;
      delete this._cache[i];
    }
  }

  private _load(pageNumber: number) {
    const minimum = pageNumber - app.settings.sessionLoadRange;
    const maximum = pageNumber + app.settings.sessionLoadRange;
    for (let i = minimum; i <= maximum; i++) {
      if (i < 1 || i > this._session.pageCount) continue;
      this._cache[i] = this._cache[i] || this._pageAsync(i);
    }
  }
  
  private async _pageAsync(pageNumber: number) {
    const sessionPage = await this._context.session.pageAsync(this._session.id, pageNumber);
    if (!sessionPage.value) throw sessionPage.error;
    return app.fanfoxProvider.isSupported(this._session.url)
      ? await app.fanfoxProvider.processAsync(sessionPage.value.image)
      : `data:;base64, ${sessionPage.value.image}`;
  }
}