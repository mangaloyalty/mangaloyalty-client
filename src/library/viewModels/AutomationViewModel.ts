import * as app from '..';
import * as mobx from 'mobx';

export class AutomationViewModel {
  private readonly _context: app.ContextApi;
  private readonly _series: app.SeriesViewModel;

  constructor(context: app.ContextApi, series: app.SeriesViewModel) {
    this._context = context;
    this._series = series;
  }

  @mobx.action
  async changeFrequency(frequency: app.IEnumeratorFrequency) {
    if (frequency === this.frequency) return;
    this.frequency = frequency;
  }
  
  @mobx.action
  refreshWith(series: app.ILibrarySeries) {
    this.frequency = series.automation.frequency;
    this.syncAll = series.automation.syncAll;
    return this;
  }

  @mobx.action
  async saveAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await this._context.library.seriesPatchAsync(this._series.id, this.frequency, this.syncAll);
      if (response.status === 200) {
        this.isOpen = false;
      } else if (response.status === 404) {
        await app.core.screen.leaveAsync();
      } else {
        await app.core.dialog.errorAsync(response.error);
        await this.saveAsync();
      }
    });
  }

  @mobx.action
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
  
  @mobx.action
  toggleSyncAll() {
    this.syncAll = !this.syncAll;
  }

  @mobx.observable
  frequency!: app.IEnumeratorFrequency;

  @mobx.observable
  isOpen = false;

  @mobx.observable
  syncAll!: boolean;
}
