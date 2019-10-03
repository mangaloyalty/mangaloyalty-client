import * as app from '..';
import * as mobx from 'mobx';

export class SeriesAutomationViewModel {
  private readonly _series: app.SeriesViewModel;

  constructor(series: app.SeriesViewModel) {
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
    this.state = {frequency: this.frequency, syncAll: this.syncAll};
    return this;
  }

  @mobx.action
  async saveAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.api.library.seriesPatchAsync(this._series.id, this.frequency, this.syncAll);
      if (response.status === 200) {
        this.showDialog = false;
        this.state = {frequency: this.frequency, syncAll: this.syncAll};
      } else if (response.status === 404) {
        await app.core.screen.leaveAsync();
      } else {
        await app.core.dialog.errorAsync(() => this.saveAsync(), response.error);
      }
    });
  }

  @mobx.action
  toggleDialog() {
    if (!this.showDialog) {
      this.frequency = this.state.frequency;
      this.syncAll = this.state.syncAll;
      this.showDialog = true;
    } else {
      this.showDialog = false;      
    }
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

  @mobx.observable
  private state!: {frequency: app.IEnumeratorFrequency, syncAll: boolean}
}
