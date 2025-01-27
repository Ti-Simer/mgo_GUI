import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UsersAtheneaMontagasService } from 'src/app/services/users-athenea-montagas.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-athenea',
  templateUrl: './login-athenea.component.html',
  styleUrls: ['./login-athenea.component.scss']
})
export class LoginAtheneaComponent {
  private languageSubscription!: Subscription;

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usersAtheneaMontagasService: UsersAtheneaMontagasService,
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

  ngOnInit(): void { }

  toPlataforms() {
    this.router.navigate(['/plataforms']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;

      switch (this.loginForm.value.server) {
        case 'athenea-montagas.9010':
          this.usersAtheneaMontagasService.loginMontagas(userData).subscribe(
            response => {
              if (response.statusCode === 200) {

                console.log(response);

                const expiresIn = 64800; // Duración en segundos (1 hora)
                this.authService.login(response.data.accessToken, expiresIn);

                const message = 'Bienvenido ' + response.data.user.firstName;
                this.toastr.success(message, response.message);

                // Redirige a otra página después del inicio de sesión exitoso
                this.router.navigate(['/home-athenea']);
              } else {
                console.error('Error en el inicio de sesión:', response.message);

                // Muestra una notificación de error
                this.toastr.error(response.message);
              }
            },
            error => {
              console.error('Error en el inicio de sesión:', error);

              // Muestra una notificación de error
              this.toastr.error('Error en el inicio de sesión', 'Ha ocurrido un error al iniciar sesión');
            }
          );

          break;

        default:
          this.toastr.warning('Ingrese un servidor válido', 'Servidor no válido');
          break;
      }

    }
  }
}
