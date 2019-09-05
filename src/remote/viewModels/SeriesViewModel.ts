import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesViewModel {
  private readonly _context: app.ContextApi;

  constructor(series: app.IRemoteSeries) {
    this._context = app.core.service.get(app.settings.contextKey);
    this._updateWith(series);
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
  }

  @mobx.action
  async openAsync(chapter: app.IRemoteSeriesChapter) {
    this.isLoading = true;
    await new app.Navigator(this._context, this.chapters, this.chapters.indexOf(chapter)).openCurrentAsync();
    this.isLoading = false;
  }

  @mobx.action
  async readAsync() {
    if (!this.chapters.length) return app.core.toast.add(language.remoteSeriesToastQuickRead);
    await this.openAsync(this.chapters[this.chapters.length - 1]);
  }

  @mobx.action
  async refreshAsync() {
    this.isLoading = true;
    const series = await this._context.remote.seriesAsync(this.url);
    if (series.value) {
      this._updateWith(series.value);
      this.isLoading = false;
    } else if (await app.core.dialog.errorAsync(true, series.error)) {
      await this.refreshAsync();
    }
  }

  @mobx.observable
  chapters!: app.IRemoteSeriesChapter[];
  
  @mobx.observable
  image!: string;

  @mobx.observable
  isLoading = false;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  summary?: string;
  
  @mobx.observable
  title!: string;

  @mobx.observable
  url!: string;

  private _updateWith(series: app.IRemoteSeries) {
    this.chapters = series.chapters;
    this.image = series.image;
    this.summary = series.summary;
    this.title = series.title;
    this.url = series.url;
  }
}
