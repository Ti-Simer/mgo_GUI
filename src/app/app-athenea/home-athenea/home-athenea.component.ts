import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-athenea',
  templateUrl: './home-athenea.component.html',
  styleUrls: ['./home-athenea.component.scss']
})
export class HomeAtheneaComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.authService.AtheneaKeyVerify();
  }

  ngOnInit(): void {
    // Verifica si el usuario tiene un token válido
    if (!this.authService.isLoggedIn()) {
      // Si no está autenticado, redirige a la página de inicio de sesión
      this.router.navigate(['/']);
    }
  }

}
