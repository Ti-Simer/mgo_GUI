import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  sidebarCollapsed = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang('es');

    this.authService.menuExpanded$.subscribe(expanded => {
      this.sidebarCollapsed = expanded;
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  toPlataforms() {
    this.router.navigate(['/plataforms'])
  }

  closeWindow() {
    window.close();
  }
}