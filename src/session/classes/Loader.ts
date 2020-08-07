import * as app from '..';

export class Loader {
  private readonly _cache: {[pageNumber: number]: Promise<{error?: string, status: number, value?: HTMLImageElement}>};
  private readonly _session: app.ISessionListItem;
  private _pageSize?: app.PageSize;

  constructor(session: app.ISessionListItem, pageSize?: app.PageSize) {
    this._cache = {};
    this._pageSize = pageSize;
    this._session = session;
  }

  changePageSize(pageSize?: app.PageSize) {
    this._expire();
    this._pageSize = pageSize;
  }

  async getAsync(pageNumber: number) {
    if (this._cache[pageNumber]) {
      const sessionPage = await this._cache[pageNumber];
      this._expire(pageNumber);
      this._load(pageNumber);
      return this._ensurePageSize(sessionPage);
    } else {
      this._cache[pageNumber] = this._pageAsync(pageNumber);
      const sessionPage = await this._cache[pageNumber];
      this._expire(pageNumber);
      this._load(pageNumber);
      return this._ensurePageSize(sessionPage);
    }
  }
  
  private _ensurePageSize(sessionPage: {error?: string, status: number, value?: HTMLImageElement}) {
    if (!sessionPage.value || !this._pageSize) return sessionPage;
    const value = resizeImage(sessionPage.value, this._pageSize);
    return {error: sessionPage.error, status: sessionPage.status, value};
  }

  private _expire(pageNumber?: number) {
    const minimum = pageNumber ? pageNumber - app.settings.sessionExpireRange : 0;
    const maximum = pageNumber ? pageNumber + app.settings.sessionExpireRange : 0;
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
    const sessionPage = await app.core.context.session.pageAsync(this._session.id, pageNumber);
    if (sessionPage.value) {
      const value = await imageAsync(sessionPage.value);
      return {status: sessionPage.status, value};
    } else {
      const error = sessionPage.error;
      delete this._cache[pageNumber];
      return {status: sessionPage.status, error};
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

function resizeImage(image: HTMLImageElement, pageSize: app.PageSize) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return image;
  canvas.height = Math.min((image.height >= image.width ? image.width : image.width / 2) * pageSize, image.height);
  canvas.width = image.width;
  context.drawImage(image, 0, 0, image.width, image.height);
  return canvas;
}
