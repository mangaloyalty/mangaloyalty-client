import * as app from '..';
import * as mobx from 'mobx';

export class SeriesAutomationViewModel {
  constructor(showAutomation?: boolean) {
    this.showDialog = Boolean(showAutomation);
  }

  @mobx.action
  async changeFrequency(frequency: app.IEnumeratorFrequency) {
    if (frequency === this.frequency) return;
    this.frequency = frequency;
  }
  
  @mobx.action
  refreshWith(series: app.ILibrarySeries) {
    if (!this.state) {
      this.frequency = series.automation.frequency;
      this.syncAll = series.automation.syncAll;
      this.state = {id: series.id, frequency: series.automation.frequency, syncAll: series.automation.syncAll};
      return this;
    } else {
      this.state.frequency = series.automation.frequency;
      this.state.syncAll = series.automation.syncAll;
      return this;
    }
  }

  @mobx.action
  async saveAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.api.library.seriesPatchAsync(this.state.id, this.frequency, this.syncAll);
      if (response.status === 200) {
        this.showDialog = false;
      } else if (response.status !== 404) {
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
  showDialog: boolean;

  @mobx.observable
  syncAll!: boolean;

  @mobx.observable
  private state!: {id: string, frequency: app.IEnumeratorFrequency, syncAll: boolean}
}
