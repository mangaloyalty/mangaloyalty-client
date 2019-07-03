import * as app from '../../..';
import * as areas from '../..';
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
      const session = await this._context.remoteStart(chapter.url);
      if (session.result) {
        core.screen.open(areas.session.ChapterController, session.result);
      } else if (await core.dialog.errorAsync(session.error)) {
        this.openAsync(chapter);
      }
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
    const series = await this._context.remoteSeries(this._url);
    if (series.result) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.source = series.result;
      });
    } else if (await core.dialog.errorAsync(series.error)) {
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
