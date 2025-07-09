import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-landing-page-contact',
  templateUrl: './landing-page-contact.component.html',
  styleUrls: ['./landing-page-contact.component.scss']
})
export class LandingPageContactComponent {
  private languageSubscription!: Subscription;

  sidebarCollapsed = false;
  
  constructor(
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private authService: AuthService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.authService.menuExpanded$.subscribe(expanded => {
      this.sidebarCollapsed = expanded;
    });
  }

  toContactForm() {
    this.router.navigate(['/contact/form']);
  }

}
