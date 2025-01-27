import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { NotificationService } from 'src/app/services/poseidon-services/notification.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';

@Component({
  selector: 'app-menu-athenea',
  templateUrl: './menu-athenea.component.html',
  styleUrls: ['./menu-athenea.component.scss']
})
export class MenuAtheneaComponent {
  userId: any;
  role: any
  isToggled: boolean = false;
  isAdmin: boolean = false;

  imgProfile: string = '../../../../assets/images/profile.svg';
  imgLogout: string = '../../../../assets/images/logout.svg';

  notifications: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private usuarioService: UsuarioService,
    private notificationService: NotificationService
  ) {
    this.userId = this.authService.getUserFromToken();
  }

  toggleMenu() {
    this.isToggled = !this.isToggled;
  }

  logout(): void {
    this.dialogService.openConfirmDialog('¿Estás seguro de cerrar la sesión?')
      .subscribe(result => {
        if (result) {
          this.authService.logout();
          this.router.navigate(['/']);
          this.toastr.info('Se ha cerrado la sesión');
        }
      });
  }

  redirectToHome() {
    this.router.navigate(['/home-athenea']);
  }

}
