import * as app from '..';
import * as areas from '../../areas'
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesViewModel {
  private readonly _context = app.core.service.get<app.ContextApi>(app.settings.contextKey);

  constructor(url: string, restoreState?: app.SeriesRestoreState) {
    this.showChapters = restoreState ? restoreState.showChapters : this.showChapters;
    this.url = url;
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
  }

  @mobx.action
  async openAsync(chapter: app.IRemoteSeriesChapter) {
    await app.core.screen.loadAsync(async () => {
      const session = await this._context.remote.startAsync(chapter.url);
      if (session.value) {
        const restoreState = new app.SeriesRestoreState(this.showChapters);
        const navigator = new app.Navigator(this._context, this.chapters, this.chapters.indexOf(chapter));
        const constructAsync = areas.session.ChapterController.createConstruct(session.value, chapter.title, navigator);
        await app.core.screen.openChildAsync(constructAsync, restoreState);
      } else if (await app.core.dialog.errorAsync(true, session.error)) {
        await this.openAsync(chapter);
      }
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
      const series = await this._context.remote.seriesAsync(this.url);
      if (series.value) {
        this.chapters = series.value.chapters;
        this.image = series.value.image;
        this.summary = series.value.summary;
        this.title = series.value.title;
        this.url = series.value.url;
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

  @mobx.observable
  url: string;
}
