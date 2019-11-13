import * as app from '..';
import * as areas from '../../areas'
import * as mobx from 'mobx';
import {language} from '../language';

// TODO: FABs should make a come-back to reduce the icon clutter on series pages.
// TODO: Virtual keyboard to make a SPA on Chrome feel like an actual app?

export class SeriesViewModel {
  constructor(imageId: string, url: string, restoreState?: app.SeriesRestoreState) {
    this.imageId = imageId;
    this.showChapters = restoreState ? restoreState.showChapters : this.showChapters;
    this.url = url;
  }
  
  @mobx.action
  async addAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.api.library.seriesCreateAsync(this.url);
      if (response.value) {
        await app.core.dialog.addedAsync();
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
  async imageDataAsync(imageId?: string) {
    if (this.imageData || !imageId) return Boolean(this.imageData);
    return await app.core.screen.loadAsync(async () => {
      const image = await app.api.remote.imageDataAsync(imageId);
      if (image.value) {
        this.imageData = image.value;
        return true;
      } else {
        return false;
      }
    });
  }

  @mobx.action
  async openAsync(chapter: app.IRemoteSeriesChapter) {
    await app.core.screen.loadAsync(async () => {
      const session = await app.api.remote.startAsync(chapter.url);
      if (session.value) {
        const restoreState = new app.SeriesRestoreState(this.showChapters);
        const navigator = new app.Navigator(this.chapters, this.chapters.indexOf(chapter));
        const constructAsync = areas.session.MainController.createConstruct(navigator, session.value, chapter.title);
        await app.core.screen.openChildAsync(constructAsync, restoreState);
      } else {
        await app.core.dialog.errorAsync(() => this.openAsync(chapter), session.error);
      }
    });
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const imageDataPromise = this.imageDataAsync(this.imageId);
      const seriesPromise = app.api.remote.seriesAsync(this.url);
      const imageData = await imageDataPromise;
      const series = await seriesPromise;
      if (imageData && series.value) {
        this.chapters = series.value.chapters;
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
  async socketActionAsync(actions: app.ISocketAction[]) {
    for (const action of actions) {
      switch (action.type) {
        case 'SeriesCreate':
          if (action.seriesUrl !== this.url) continue;
          await app.core.screen.replaceChildAsync(areas.library.SeriesController.createConstruct(action.seriesId, undefined, this.showChapters));
          break;
      }
    }
  }

  @mobx.observable
  chapters!: app.IRemoteSeriesChapter[];
  
  @mobx.observable
  imageData!: string;

  @mobx.observable
  imageId: string;

  @mobx.observable
  showChapters = false;

  @mobx.observable
  summary?: string;
  
  @mobx.observable
  title!: string;

  @mobx.observable
  url: string;
}
