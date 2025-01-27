import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/hercules-services/user.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-login-hercules',
  templateUrl: './login-hercules.component.html',
  styleUrls: ['./login-hercules.component.scss']
})
export class LoginHerculesComponent {
  private languageSubscription!: Subscription;
  
  loginForm: FormGroup;
  showServer: boolean = false;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.loginForm = this.formBuilder.group({
      credentials: [null, Validators.required],
      password: [null, Validators.required],
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

  toPlataforms() {
    this.router.navigate(['/plataforms']);
  }

  toggleShowServer() {
    this.showServer = !this.showServer;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;

      this.userService.loginHercules(userData).subscribe(
        response => {
          if (response.statusCode === 200) {
            const expiresIn = 64800; // Duración en segundos (1 hora)
            this.authService.login(response.data.accessToken, expiresIn);

            const message = this.translate.instant('Bienvenido') + ' ' + response.data.user.firstName;
            this.toastr.success(message, response.message);
            
            this.router.navigate(['/hercules/home']);
          } else {
            console.error('Error en el inicio de sesión:', response.message);
            this.toastr.error(response.message);
          }
        },
        error => {
          console.error('Error en el inicio de sesión:', error);
          this.toastr.error(this.translate.instant('Error en el inicio de sesión'), this.translate.instant('Ha ocurrido un error al iniciar sesión'));
        }
      );
    }
  }

}
