import * as app from '.';

export const settings = {
  developerMode: true,
  httpTimeout: 30000,
  providerDefaultName: 'fanfox' as app.IProviderName,
  providerNames: ['batoto', 'fanfox'] as app.IProviderName[]
};
