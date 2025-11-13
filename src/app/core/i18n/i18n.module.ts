import { NgModule } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateFormatJsCompiler } from 'ngx-translate-formatjs-compiler';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        deps: [HttpClient],
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateFormatJsCompiler,
      },
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
  exports: [
    TranslateModule,
  ],
})
export class I18nModule {

  constructor(private translate: TranslateService) {
    const languages = ['en', 'fr', 'ar'];
    this.translate.setDefaultLang('en');
    this.translate.addLangs(languages);
    this.translate.use('en');

    const htmlElement = document.getElementsByTagName("html")[0];
    htmlElement.lang = 'en';
  }

}

export function translateLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}