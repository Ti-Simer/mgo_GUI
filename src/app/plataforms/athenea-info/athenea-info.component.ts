import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-athenea-info',
  templateUrl: './athenea-info.component.html',
  styleUrls: ['./athenea-info.component.scss']
})
export class AtheneaInfoComponent {
  private languageSubscription!: Subscription;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
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

  toPlataforms() {
    this.router.navigate(['/plataforms']);
  }

  toAtheneaLoginWeb() {
    this.router.navigate(['https://athenea.montagas.com.co/index.php']);
  }

}
