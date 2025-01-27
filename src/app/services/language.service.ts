import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>(this.getLanguage());

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'es', 'pt']);
    const browserLang = translate.getBrowserLang();
    const defaultLang = 'es';
    translate.use(browserLang && browserLang.match(/en|es|pt/) ? browserLang : defaultLang);
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.translate.setDefaultLang(language);
    localStorage.setItem('language', language);
    this.languageSubject.next(language); // Emitir el nuevo idioma
  }

  getLanguage(): string {
    return localStorage.getItem('language') || 'es';
  }

  getLanguageObservable() {
    return this.languageSubject.asObservable();
  }
}