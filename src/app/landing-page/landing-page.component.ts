import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  constructor(
    private router: Router,
    private translate: TranslateService
  ){
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang('es');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  toPlataforms(){
    this.router.navigate(['/plataforms'])
  }

  closeWindow(){
    window.close();
  }
}