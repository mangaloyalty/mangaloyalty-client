import * as app from '..';

export class Loader {
  private readonly _cache: {[pageNumber: number]: Promise<{error?: string, status: number, value?: string}>};
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
      const sessionPagePromise = this._pageAsync(pageNumber);
      const sessionPage = await sessionPagePromise;
      this._cache[pageNumber] = sessionPagePromise;
      this._expire(pageNumber);
      this._load(pageNumber);
      return sessionPage;
    }
  }

  async revokeAsync() {
    for (let i = 1; i < this._session.pageCount; i++) {
      if (!this._cache[i]) continue;
      revoke(this._cache[i]);
    }
  }
  
  private _expire(pageNumber: number) {
    const minimum = pageNumber - app.settings.sessionLoadRange;
    const maximum = pageNumber + app.settings.sessionLoadRange;
    for (let i = 1; i < this._session.pageCount; i++) {
      if (i >= minimum && i <= maximum) continue;
      if (this._cache[i]) revoke(this._cache[i]);
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
    const sessionPage = await app.api.session.pageAsync(this._session.id, pageNumber);
    if (sessionPage.value && app.fanfoxProvider.isSupported(this._session.url)) {
      const value = await app.fanfoxProvider.processAsync(sessionPage.value);
      return {error: sessionPage.error, status: sessionPage.status, value: URL.createObjectURL(value)};
    } else if (sessionPage.value) {
      const value = sessionPage.value;
      return {error: sessionPage.error, status: sessionPage.status, value: URL.createObjectURL(value)};
    } else {
      return sessionPage;
    }
  }
}

function revoke(pagePromise: Promise<{value?: string}>) {
  pagePromise.then((page) => {
    if (!page.value) return;
    URL.revokeObjectURL(page.value);
  });
}
