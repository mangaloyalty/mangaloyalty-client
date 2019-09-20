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
    await app.core.screen.loadAsync(async () => {
      await new app.Navigator(this._context, this.chapters, this.chapters.indexOf(chapter)).openCurrentAsync();
    });
  }

  @mobx.action
  async readAsync() {
    if (!this.chapters.length) return app.core.toast.add(language.remoteSeriesToastQuickRead);
    await this.openAsync(this.chapters[this.chapters.length - 1]);
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const series = await this._context.remote.seriesAsync(this._url);
      if (series.value) {
        this.chapters = series.value.chapters;
        this.image = series.value.image;
        this.summary = series.value.summary;
        this.title = series.value.title;
      } else if (await app.core.dialog.errorAsync(true, series.error)) {
        await this.refreshAsync();
      }
    });
  }

  @mobx.observable
  chapters!: app.IRemoteSeriesChapter[];
  
  @mobx.observable
  image!: string;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  summary?: string;
  
  @mobx.observable
  title!: string;
}
