import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page-contact',
  templateUrl: './landing-page-contact.component.html',
  styleUrls: ['./landing-page-contact.component.scss']
})
export class LandingPageContactComponent {
  private languageSubscription!: Subscription;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
  }

  toContactForm(){ 
    this.router.navigate(['/contact/form']);
  }

}
