import * as app from '../../..';
import * as mobx from 'mobx';
const core = app.core;

export class SeriesViewModel {
  private readonly _context: app.ContextApi;
  private readonly _title: string;
  private readonly _url: string;

  constructor(title: string, url: string) {
    this._context = core.service.get('ContextApi');
    this._title = title;
    this._url = url;
    this.refreshAsync();
  }
  
  @mobx.action
  async openAsync(chapter: app.ISeriesDetailChapter) {
    try {
      this.isLoading = true;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // session em
      console.log(chapter);
    } finally {
      mobx.runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const seriesDetail = await this._context.remoteSeries(this._url);
    if (seriesDetail.result) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.source = seriesDetail.result;
      });
    } else if (await core.dialog.errorAsync(seriesDetail.error)) {
      this.refreshAsync(true);
    }
  }

  @mobx.computed
  get chapters() {
    return this.source && this.source.chapters;
  }

  @mobx.computed
  get image() {
    return this.source && this.source.image;
  }

  @mobx.computed
  get summary() {
    return this.source && this.source.summary; 
  }

  @mobx.computed
  get title() {
    return this.source && this.source.title || this._title;
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  private source?: app.ISeriesDetail;
}
