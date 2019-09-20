import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesViewModel {
  private readonly _context = app.core.service.get<app.ContextApi>(app.settings.contextKey);
  private readonly _url: string;

  constructor(url: string) {
    this._url = url;
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
    const series = await this._context.remote.seriesAsync(this._url);
    if (series.value) {
      this.chapters = series.value.chapters;
      this.image = series.value.image;
      this.summary = series.value.summary;
      this.title = series.value.title;
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
}
