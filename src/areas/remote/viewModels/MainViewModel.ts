import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  constructor() {
    this.provider = new area.ProviderViewModel(app.settings.providerDefaultName);
    this.provider.refreshAsync();
  }
  
  @mobx.action
  changeProvider(name: app.IProviderName) {
    if (name === this.provider.name) return;
    this.provider = new area.ProviderViewModel(name);
    this.provider.changeSearch(this.search);
  }

  @mobx.action
  changeSearch(search: string) {
    if (search === this.search) return;
    this.provider.changeSearch(search);
    this.search = search;
  }

  @mobx.action
  refreshAsync() {
    this.provider.refreshAsync();
  }

  @mobx.computed
  get isLoading() {
    return this.provider.isLoading;
  }
  
  @mobx.observable
  provider: area.ProviderViewModel;

  @mobx.observable
  search = '';
}
