import * as app from '..';
import * as mobx from 'mobx';
import {language} from '../language';

// TODO: Completing a chapter should update the list and change the unreadCount.
// TODO: Use tslib helper for more efficient resource usage.
export class SeriesViewModel {
  private readonly _context: app.ContextApi;

  constructor(series: app.ILibrarySeries) {
    this._context = app.core.service.get(app.settings.contextKey);
    this._updateWith(series);
  }
  
  @mobx.action
  changeShowChapters(showChapters: boolean) {
    this.showChapters = showChapters;
  }

  @mobx.action
  async readAsync() {
    for (let i = this.chapters.length - 1; i >= 0; i--) if (!this.chapters[i].isReadCompleted) return await this.chapters[i].openAsync();
    app.core.toast.add(language.librarySeriesToastQuickRead);
  }

  @mobx.action
  async refreshAsync() {
    this.isLoading = true;
    const series = await this._context.library.seriesReadAsync(this.id);
    if (series.value) {
      mobx.runInAction(() => {
        this._updateWith(series.value!);
        this.isLoading = false;
      });
    } else if (await app.core.dialog.errorAsync(true, series.error)) {
      await this.refreshAsync();
    }
  }

  @mobx.observable
  chapters!: app.ChapterViewModel[];

  @mobx.observable
  id!: string;

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

  // TODO: Update existing ViewModels to prevent a re-render?
  private _updateWith(series: app.ILibrarySeries) {
    this.chapters = series.chapters.map((chapter) => new app.ChapterViewModel(this._context, this, chapter));
    this.id = series.id;
    this.image = series.source.image;
    this.summary = series.source.summary;
    this.title = series.source.title;
  }
}
