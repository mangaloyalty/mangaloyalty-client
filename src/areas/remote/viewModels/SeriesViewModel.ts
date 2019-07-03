import * as app from '../../..';
import * as mobx from 'mobx';

export class SeriesViewModel {
  private readonly _context = app.serviceManager.get<app.ContextApi>('ContextApi');

  constructor(title: string, url: string) {
    this.chapters = [];
    this.title = title;
    this.url = url;
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
    const seriesDetail = await this._context.remoteSeries(this.url);
    if (seriesDetail.result) {
      mobx.runInAction(() => {
        this.chapters = seriesDetail.result!.chapters;
        this.image = seriesDetail.result!.image;
        this.summary = seriesDetail.result!.summary;
        this.title = seriesDetail.result!.title;
        this.isLoading = false;
      });
    } else if (await app.dialogManager.errorAsync(seriesDetail.error)) {
      this.refreshAsync(true);
    }
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  chapters: app.ISeriesDetailChapter[];

  @mobx.observable
  image?: string;

  @mobx.observable
  summary?: string;

  @mobx.observable
  title: string;

  @mobx.observable
  url: string;
}
