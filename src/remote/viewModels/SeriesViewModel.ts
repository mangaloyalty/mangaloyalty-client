import * as app from '..';
import * as areas from '../..'
import * as mobx from 'mobx';
import {language} from '../language';

export class SeriesViewModel {
  constructor(url: string, restoreState?: app.SeriesRestoreState) {
    this.showChapters = restoreState ? restoreState.showChapters : this.showChapters;
    this.url = url;
  }
  
  @mobx.action
  async addAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.core.context.library.seriesCreateAsync(this.url);
      if (response.value) {
        return;
      } else {
        await app.core.dialog.errorAsync(() => this.addAsync(), response.error);
      }
    });
  }

  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
    scrollTo(0, 0);
  }

  @mobx.action
  async openAsync(chapter: app.IRemoteSeriesChapter) {
    await app.core.screen.loadAsync(async () => {
      const session = await app.core.context.remote.startAsync(chapter.url);
      if (session.value) {
        const restoreState = new app.SeriesRestoreState(this.showChapters);
        const navigator = new app.Navigator(this.chapters, this.chapters.indexOf(chapter));
        const constructAsync = areas.session.MainController.createConstruct(navigator, 1, session.value, chapter.title);
        await app.core.screen.openChildAsync(constructAsync, restoreState);
      } else {
        await app.core.dialog.errorAsync(() => this.openAsync(chapter), session.error);
      }
    });
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const series = await app.core.context.remote.seriesAsync(this.url);
      if (series.value) {
        this.authors = series.value.authors;
        this.chapters = series.value.chapters;
        this.genres = series.value.genres;
        this.isCompleted = series.value.isCompleted;
        this.imageId = series.value.imageId;
        this.summary = series.value.summary;
        this.title = series.value.title;
        this.url = series.value.url;
      } else {
        await app.core.dialog.errorAsync(() => this.refreshAsync(), series.error);
      }
    });
  }

  @mobx.action
  async startAsync() {
    for (let i = this.chapters.length - 1; i >= 0; i--) return await this.openAsync(this.chapters[i]);
    app.core.toast.add(language.remoteSeriesToastQuickRead);
  }

  @mobx.action
  async socketActionAsync(actionList: app.IClientActionList) {
    for (const action of actionList) {
      switch (action.type) {
        case 'SeriesCreate':
          if (action.seriesUrl !== this.url) continue;
          await app.core.screen.replaceChildAsync(areas.library.SeriesController.createConstruct(action.seriesId, true));
          break;
      }
    }
  }

  @mobx.observable
  authors!: string[];

  @mobx.observable
  chapters!: app.IRemoteSeriesChapter[];
  
  @mobx.observable
  genres!: string[];
  
  @mobx.observable
  imageId!: string;

  @mobx.observable
  isCompleted!: boolean;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  summary?: string;
  
  @mobx.observable
  title!: string;

  @mobx.observable
  url: string;
}
