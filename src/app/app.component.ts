import { Component } from '@angular/core';
import { I18nModule } from './core/i18n/i18n.module';

@Component({
  selector: 'app-root',
  imports: [I18nModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public title = 'simple-i18n-app';

}