import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { NotificationService } from 'src/app/services/poseidon-services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-menu-home',
  templateUrl: './menu-home.component.html',
  styleUrls: ['./menu-home.component.scss']
})
export class MenuHomeComponent {
  private subscription!: Subscription;
  private languageSubscription!: Subscription;
  language: string = this.languageService.getLanguage();

  userId: any;
  role: any
  isToggled: boolean = false;

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
    private notificationService: NotificationService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.userId = this.authService.getUserFromToken();
    this.fetchNotifications();
  }

  ngOnInit(): void {
    this.languageSubscription = this.languageService.getLanguageObservable().subscribe(newLanguage => {
      this.translate.use(newLanguage);
      this.translate.setDefaultLang(newLanguage);
    });
  }

  switchLanguage(language: string) {
    this.languageService.switchLanguage(language);
    this.language = language;
  }

  fetchNotifications() {
    const polling$ = interval(500);

    this.subscription = polling$
      .pipe(switchMap(() => this.notificationService.getUnread()))
      .subscribe(
        response => {
          this.notifications = response.data;
        },
        error => {
          console.error('Error al obtener las notificaciones:', error);
        }
      );
  }

  ngOnDestroy() {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
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

  redirectToLandingPage() {
    this.router.navigate(['/poseidon/home']);
  }

  toRoles() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/roles/list']);
      }
    });
  }

  toPermissions() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/permissions/list']);
      }
    });
  }

  toUsers() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/usuarios/list']);
      }
    });
  }

  toClients() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/client/list']);
      }
    });
  }

  toDepartments() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/department/list']);
      }
    });
  }

  toCities() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/city/list']);
      }
    });
  }

  toZones() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/zone/list']);
      }
    });
  }

  toBranchOffices() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/branch-offices/list']);
      }
    });
  }

  toOccupations() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/occupation/list']);
      }
    });
  }

  toFactor() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/factor/list']);
      }
    });
  }

  toCourses() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/courses/admin']);
      }
    });
  }

  toPropaneTrucks() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/propane-trucks/list']);
      }
    });
  }

  toStationaryTanks() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/stationary-tank/list']);
      }
    });
  }

  toTablets() {
        this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/tablets/list']);
      }
    });
  }

  toProfile() {
    this.router.navigate(['/poseidon/usuarios/profile/', this.authService.encryptData(this.userId)]);
  }

  toNotifications() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/notifications/list']);
      }
    });
  }
}
