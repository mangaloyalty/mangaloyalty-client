import * as app from '..';

export class Loader {
  private readonly _cache: {[pageNumber: number]: Promise<{error?: string, status: number, value?: HTMLImageElement}>};
  private readonly _session: app.ISessionListItem;

  constructor(session: app.ISessionListItem) {
    this._cache = {};
    this._session = session;
  }

  async getAsync(pageNumber: number) {
    if (this._cache[pageNumber]) {
      this._expire(pageNumber);
      this._load(pageNumber);
      return await this._cache[pageNumber];
    } else {
      this._cache[pageNumber] = this._pageAsync(pageNumber);
      const sessionPage = await this._cache[pageNumber];
      this._expire(pageNumber);
      this._load(pageNumber);
      return sessionPage;
    }
  }
  
  private _expire(pageNumber: number) {
    const minimum = pageNumber - app.settings.sessionExpireRange;
    const maximum = pageNumber + app.settings.sessionExpireRange;
    for (let i = 1; i < this._session.pageCount; i++) {
      if (i >= minimum && i <= maximum) continue;
      delete this._cache[i];
    }
  }

  private _load(pageNumber: number) {
    const minimum = pageNumber - app.settings.sessionPreloadPreviousRange;
    const maximum = pageNumber + app.settings.sessionPreloadNextRange;
    for (let i = minimum; i <= maximum; i++) {
      if (i < 1 || i > this._session.pageCount) continue;
      this._cache[i] = this._cache[i] || this._pageAsync(i);
    }
  }
  
  private async _pageAsync(pageNumber: number) {
    const sessionPage = await app.api.session.pageAsync(this._session.id, pageNumber);
    if (sessionPage.value && app.fanfoxProvider.isSupported(this._session.url)) {
      const current = await imageAsync(sessionPage.value);
      const result = await app.fanfoxProvider.processAsync(current);
      const value = result && await imageAsync(result) || current;
      return {status: sessionPage.status, value};
    } else if (sessionPage.value) {
      const value = await imageAsync(sessionPage.value);
      return {status: sessionPage.status, value};
    } else {
      delete this._cache[pageNumber];
      return sessionPage;
    }
  }
}

async function imageAsync(value: Blob) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    const revokeUrl = () => Boolean(URL.revokeObjectURL(element.src));
    element.addEventListener('error', () => revokeUrl() || reject(new Error()));
    element.addEventListener('load', () => revokeUrl() || resolve(element));
    element.src = URL.createObjectURL(value);
  });
}
