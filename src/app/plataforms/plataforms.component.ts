import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-plataforms',
  templateUrl: './plataforms.component.html',
  styleUrls: ['./plataforms.component.scss']
})
export class PlataformsComponent {
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

  toPoseidonLogin() {
    this.router.navigate(['/poseidon/usuarios/login']);
  }

  toLoginAthenea() {
    this.router.navigate(['/athenea/users/login-athenea']);
  }

  toLoginFenix() {
    this.router.navigate(['/fenix/users/login-fenix']);
  }

  toLoginHercules() {
    this.router.navigate(['/hercules/users/login-hercules']);
  }

  toAtheneaLoginWeb() {
    this.router.navigate(['https://athenea.montagas.com.co/index.php']);
  }

  toAtheneaInfo() {
    this.router.navigate(['/plataforms/athenea-info']);
  }

  toPoseidonInfo() {
    this.router.navigate(['/plataforms/poseidon-info']);
  }

}
