import * as app from '..';
import * as mobx from 'mobx';
const storageProvider = 'RemoteProvider';

export class MainViewModel {
  constructor() {
    const providerName = app.core.storage.get(storageProvider, app.settings.providerDefaultName as app.IEnumeratorProvider);
    this.provider = new app.ProviderViewModel(providerName);
    this.provider.refreshAsync();
  }
  
  @mobx.action
  changeProvider(providerName: app.IEnumeratorProvider) {
    if (providerName === this.provider.name) return;
    app.core.storage.set(storageProvider, providerName);
    this.provider = new app.ProviderViewModel(providerName);
    this.provider.refreshAsync();
  }

  @mobx.action
  changeSearch(search: string) {
    if (search === this.search) return;
    this.search = search;
    this.provider.changeSearch(search);
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
  provider: app.ProviderViewModel;

  @mobx.observable
  search = '';
}
