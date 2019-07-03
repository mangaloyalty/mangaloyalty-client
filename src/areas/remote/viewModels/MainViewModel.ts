import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  @mobx.action
  changeProvider(name: app.IProviderName) {
    if (name === this.provider.name) return;
    this.provider = new area.ProviderViewModel(name, this.searchTitle);
  }

  @mobx.action
  changeSearchTitle(searchTitle: string) {
    if (searchTitle === this.searchTitle) return;
    this.provider.changeSearchTitle(searchTitle);
    this.searchTitle = searchTitle;
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
  provider = new area.ProviderViewModel(app.settings.providerDefaultName, '');

  @mobx.observable
  searchTitle = '';
}
