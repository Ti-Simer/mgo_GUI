import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-us',
  templateUrl: './landing-page-us.component.html',
  styleUrls: ['./landing-page-us.component.scss']
})
export class LandingPageUsComponent {

  private languageSubscription!: Subscription;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private router: Router
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
  }

  ngOnInit(): void {
    this.languageSubscription = this.languageService.getLanguageObservable().subscribe(newLanguage => {
      this.translate.use(newLanguage);
      this.translate.setDefaultLang(newLanguage);
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  toPlataforms(): void {
    this.router.navigate(['/plataforms']);
  }

  toContact(): void {
    this.router.navigate(['/contact']);
  }
}
