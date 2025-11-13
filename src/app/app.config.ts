import { I18nModule } from './core/i18n/i18n.module';
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(I18nModule),
  ]
};