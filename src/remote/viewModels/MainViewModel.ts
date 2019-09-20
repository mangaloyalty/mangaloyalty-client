import * as app from '..';
import * as mobx from 'mobx';
const storageProvider = 'RemoteProvider';

export class MainViewModel {
  private readonly _context = app.core.service.get<app.ContextApi>(app.settings.contextKey);

  @mobx.action
  async changeProviderAsync(providerName: app.IEnumeratorProvider) {
    if (providerName === this.providerName) return;
    app.core.storage.set(storageProvider, providerName);
    this.providerName = providerName;
    await this.refreshAsync();
  }

  @mobx.action
  async changeSearchAsync(search: string) {
    if (search === this.search) return;
    this.search = search;
    await this.refreshAsync();
  }

  @mobx.action
  async openAsync(url: string) {
    await app.core.screen.openChildAsync(app.SeriesController.createConstruct(url));
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const seriesList = this.search
        ? await this._context.remote.searchAsync(this.providerName, this.search)
        : await this._context.remote.popularAsync(this.providerName);
      if (seriesList.value) {
        this.series = seriesList.value;
      } else if (await app.core.dialog.errorAsync(true, seriesList.error)) {
        await this.refreshAsync();
      }
    });
  }

  @mobx.observable
  providerName = app.core.storage.get(storageProvider, app.settings.providerDefaultName as app.IEnumeratorProvider);
  
  @mobx.observable
  search = '';
  
  @mobx.observable
  series!: app.IRemoteList;
}
