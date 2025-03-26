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

  detectRegionAndSetCurrency(): string {
    const locale = navigator.language || 'en-US';
  
    // Extraer solo el idioma (por ejemplo, 'es' de 'es-419')
    const language = locale.split('-')[0];
  
    // Mapear regiones a códigos de moneda
    const regionToCurrencyMap: { [key: string]: string } = {
      'en': 'USD', // Inglés
      'es': 'COP', // Español (predeterminado a COP)
      'fr': 'EUR', // Francés
      'de': 'EUR', // Alemán
      'pt': 'BRL', // Portugués (Brasil)
      // Agrega más idiomas según sea necesario
    };
  
    // Establecer la moneda según el idioma o región completa
    return regionToCurrencyMap[locale] || regionToCurrencyMap[language] || 'USD';
  }
}