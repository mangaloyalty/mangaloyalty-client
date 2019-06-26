import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  constructor() {
    this.provider = new area.ProviderViewModel(app.settings.defaultProvider);
    this.provider.refreshAsync();
  }

  @mobx.action
  changeProvider(name: app.IProviderName) {
    if (this.provider.name === name) return;
    this.provider = new area.ProviderViewModel(name);
    this.provider.changeSearchTitle(this.searchTitle);
    this.provider.refreshAsync();
  }

  @mobx.action
  changeSearchTitle(searchTitle: string) {
    this.provider.changeSearchTitle(searchTitle);
    this.searchTitle = searchTitle;
  }

  @mobx.action
  refreshAsync() {
    this.provider.refreshAsync();
  }
  
  @mobx.observable
  provider: area.ProviderViewModel;

  @mobx.observable
  providerNames = app.settings.providers;

  @mobx.observable
  searchTitle = '';
}
