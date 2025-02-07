import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private languageSubscription!: Subscription;
  
  loginForm: FormGroup;
  showServer: boolean = false;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
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
      server: ["", Validators.required]
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

      this.usuarioService.login(userData).subscribe(
        response => {
          if (response.statusCode === 200) {
            const expiresIn = 64800; // Duración en segundos (1 hora)
            this.authService.login(response.data.accessToken, expiresIn);

            const message = this.translate.instant('Bienvenido') + ' ' + response.data.user.firstName + response.data.user.lastName;
            this.toastr.success(message, response.message);

            this.router.navigate(['/poseidon/home']);
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