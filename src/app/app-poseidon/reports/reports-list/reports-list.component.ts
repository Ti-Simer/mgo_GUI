import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent {
  private languageSubscription!: Subscription;

  reportForm: FormGroup;

  reports: any = []

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.reportForm = this.formBuilder.group({
      report: ["Auto Tanques", Validators.required]
    })
  }

  ngOnInit(): void {
    this.languageSubscription = this.languageService.getLanguageObservable().subscribe(newLanguage => {
      this.translate.use(newLanguage);
      this.translate.setDefaultLang(newLanguage);

      switch (this.languageService.getLanguage()) {
        case 'es':
          this.reports = [
            { name: "Auto Tanques" },
          ]
          break;

        case 'en':
          this.reports = [
            { name: "Auto Tanks" },
          ]
          break;

        case 'pt':
          this.reports = [
            { name: "Auto Tanques" },
          ]
          break;
      
        default:
          break;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  onSubmit() {
    console.log(this.reportForm.value);
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }
}
