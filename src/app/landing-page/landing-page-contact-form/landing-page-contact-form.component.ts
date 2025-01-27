import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page-contact-form',
  templateUrl: './landing-page-contact-form.component.html',
  styleUrls: ['./landing-page-contact-form.component.scss']
})
export class LandingPageContactFormComponent {
  private languageSubscription!: Subscription;

  contactForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) { 
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.contactForm = this.formBuilder.group({
      name: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      message: [null, Validators.required]
    });
  }

  onSubmit(){}

  toContact(){
    this.router.navigate(['/contact']);
  }

}
