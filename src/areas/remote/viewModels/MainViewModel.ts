import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  constructor() {
    this.provider = new area.ProviderViewModel('fanfox');
    this.provider.refreshAsync();
    this.providerNames = ['batoto', 'fanfox'];
    this.search = '';
  }

  @mobx.action
  changeProvider(name: app.IProviderName) {
    if (this.provider.name === name) return;
    this.provider = new area.ProviderViewModel(name);
    this.provider.changeSearch(this.search);
  }

  @mobx.action
  changeSearch(search: string) {
    this.search = search;
    this.provider.changeSearch(search);
  }

  @mobx.action
  refreshAsync() {
    this.provider.refreshAsync();
  }
  
  @mobx.observable
  provider: area.ProviderViewModel;

  @mobx.observable
  providerNames: app.IProviderName[];

  @mobx.observable
  search: string;
}
