import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent {
  private languageSubscription!: Subscription;
  private subscription!: Subscription;

  userId: any;
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toUserList();
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });

    this.route.params.subscribe(params => {
      this.userId = authService.decryptData(params['id']);
    });
  }

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    const polling$ = interval(500);

    this.subscription = polling$
      .pipe(switchMap(() => this.usuarioService.getUserById(this.userId)))
      .subscribe(
        response => {
          this.user = response.data;
        },
        (error) => {
          console.error('Error al obtener el usuario:', error);
        }
      );
  }

  ngOnDestroy() {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  deleteUser() {
    this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar al usuario ${this.user.firstName} ${this.user.lastName}?`)
      .subscribe(result => {
        if (result) {
          this.usuarioService.deleteUser(this.user.id).subscribe(
            (response) => {
              if (response.statusCode === 200) {
                this.toastr.success('Usuario eliminado exitosamente', 'Éxito');
              } else {
                this.toastr.error('Error al eliminar usuario', response.message);
              }
            },
            (error) => {
              this.toastr.error('Error al eliminar usuario', 'Error');
            }
          );
        }
      });
  }

  activateUser() {
    this.dialogService.openConfirmDialog(`¿Estás seguro de activar al usuario ${this.user.firstName} ${this.user.lastName}?`)
      .subscribe(result => {
        if (result) {
          this.usuarioService.activateUser(this.user.id).subscribe(
            (response) => {
              if (response.statusCode === 200) {
                this.toastr.success('Usuario activado exitosamente', 'Éxito');
              } else {
                this.toastr.error('Error al activar usuario', response.message);
              }
            },
            (error) => {
              this.toastr.error('Error al activar usuario', 'Error');
            }
          );
        }
      });
  }

  toEditUser(user: any) {
    const dialogRef = this.dialog.open(DialogEditUserComponent, {
      width: '600px',
      data: { userId: user.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchUser();
    });
  }

  toUserList() {
    this.router.navigate(['/poseidon/usuarios/list']);
  }

}
