import * as app from '..';
import * as mobx from 'mobx';

export class SeriesAutomationViewModel {
  private readonly _series: app.SeriesViewModel;

  constructor(private _context: app.ContextApi, series: app.SeriesViewModel) {
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
        this.showDialog = false;
      } else if (response.status === 404) {
        await app.core.screen.leaveAsync();
      } else {
        await app.core.dialog.errorAsync(response.error);
        await this.saveAsync();
      }
    });
  }

  @mobx.action
  toggleDialog() {
    this.showDialog = !this.showDialog;
  }
  
  @mobx.action
  toggleSyncAll() {
    this.syncAll = !this.syncAll;
  }

  @mobx.observable
  frequency!: app.IEnumeratorFrequency;

  @mobx.observable
  showDialog = false;

  @mobx.observable
  syncAll!: boolean;
}
