import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page-legal-warning',
  templateUrl: './landing-page-legal-warning.component.html',
  styleUrls: ['./landing-page-legal-warning.component.scss']
})
export class LandingPageLegalWarningComponent {
  private languageSubscription!: Subscription;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
  }

}
