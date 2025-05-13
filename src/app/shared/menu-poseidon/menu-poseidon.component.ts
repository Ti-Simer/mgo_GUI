import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { NotificationService } from 'src/app/services/poseidon-services/notification.service';
import { LucideAngularModule, Codepen, Building2, Mail, Languages } from 'lucide-angular';
import { DialogService } from 'src/app/services/dialog.service';
import { ConfigurationService } from 'src/app/services/poseidon-services/configuration.service';

@Component({
  selector: 'app-menu-poseidon',
  templateUrl: './menu-poseidon.component.html',
  styleUrls: ['./menu-poseidon.component.scss']
})
export class MenuPoseidonComponent {

  notifications = [];
  userId: any;
  language: string = 'es';
  isLogged: boolean = false;
  configuration: any;
  readonly Languages = Languages;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit(): void {
    this.fetchNotifications();
  }

  switchLanguage(language: string) {
    this.languageService.switchLanguage(language);
    this.language = language;
  }

  fetchNotifications() {
    this.notificationService.getUnread().subscribe(
      response => {
        this.notifications = response.data;
      }
    );
  }

  logout(): void {
    this.dialogService.openConfirmDialog('¿Estás seguro de cerrar la sesión?')
      .subscribe(result => {
        if (result) {
          this.authService.logout();
          this.router.navigate(['/']);
          this.toastr.info('Se ha cerrado la sesión');
          this.getConfigurationSheet();
        }
      });
  }

  getConfigurationSheet() {
    try {
      if (!this.isLogged) {
        return;
      }
      this.configurationService.getAll().subscribe(
        response => {
          console.log('ConfigurationService::', response);
          if (response.statusCode == 200) {
            this.configuration = response.data[0];
          } else {
            this.router.navigate(['/poseidon/configuration']);
          }
        }
      );
    } catch (error) {
      this.toastr.error('No se pudo cargar la configuración del sistema');
    }
  }

  ///////////////Rutas del menú de navegación////////////////////

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

  toOrders() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/orders/list']);
      }
    });
  }

  toRequest() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/request/list']);
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

  redirectToHome() {
    this.router.navigate(['/poseidon/home']);
  }

}
