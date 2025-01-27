import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/fenix-services/user.service';

@Component({
  selector: 'app-login-fenix',
  templateUrl: './login-fenix.component.html',
  styleUrls: ['./login-fenix.component.scss']
})
export class LoginFenixComponent {
  
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      credentials: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void { }

  toPlataforms() {
    this.router.navigate(['/plataforms']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;      

      this.userService.loginFenix(userData).subscribe(
        response => {
          if (response.statusCode === 200) {
            const expiresIn = 64800; // Duración en segundos (1 hora)
            this.authService.login(response.data.accessToken, expiresIn);
            //this.authService.login(response.data.accessToken);
            
            const message = 'Bienvenido ' + response.data.user.nombre + ' ' + response.data.user.apellido + '!';
            this.toastr.success(message, response.message);

            // Redirige a otra página después del inicio de sesión exitoso
            this.router.navigate(['/fenix']);
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
    }
  }

}
