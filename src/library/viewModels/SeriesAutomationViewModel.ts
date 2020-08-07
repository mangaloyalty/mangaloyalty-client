import * as app from '..';
import * as mobx from 'mobx';

export class SeriesAutomationViewModel {
  constructor(showAutomation?: boolean) {
    this.showDialog = Boolean(showAutomation);
  }

  @mobx.action
  changeFrequency(frequency: app.IEnumeratorFrequency) {
    if (frequency === this.frequency) return;
    this.frequency = frequency;
  }
  
  @mobx.action
  changeStrategy(strategy: app.IEnumeratorStrategy) {
    if (strategy === this.strategy) return;
    this.strategy = strategy;
  }
  
  @mobx.action
  async commitAsync() {
    await app.core.screen.loadAsync(async () => {
      const response = await app.core.context.library.seriesPatchAsync(this.state.id, this.frequency, this.strategy);
      if (response.status === 200) {
        this.showDialog = false;
      } else if (response.status !== 404) {
        await app.core.dialog.errorAsync(() => this.commitAsync(), response.error);
      }
    });
  }

  @mobx.action
  refreshWith(series: app.ILibrarySeries) {
    if (!this.state) {
      this.frequency = series.automation.frequency;
      this.strategy = series.automation.strategy;
      this.state = {id: series.id, frequency: series.automation.frequency, strategy: series.automation.strategy};
      return this;
    } else {
      this.state.frequency = series.automation.frequency;
      this.state.strategy = series.automation.strategy;
      return this;
    }
  }

  @mobx.action
  toggleDialog() {
    if (!this.showDialog) {
      this.frequency = this.state.frequency;
      this.strategy = this.state.strategy;
      this.showDialog = true;
    } else {
      this.showDialog = false;
    }
  }
  
  @mobx.observable
  frequency!: app.IEnumeratorFrequency;

  @mobx.observable
  showDialog: boolean;

  @mobx.observable
  strategy!: app.IEnumeratorStrategy;

  @mobx.observable
  private state!: {id: string, frequency: app.IEnumeratorFrequency, strategy: app.IEnumeratorStrategy};
}
