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
  selector: 'app-menu-hercules',
  templateUrl: './menu-hercules.component.html',
  styleUrls: ['./menu-hercules.component.scss']
})
export class MenuHerculesComponent {
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
    // this.fetchNotifications();
  }

  switchLanguage(language: string) {
    this.languageService.switchLanguage(language);
    this.language = language;
  }

  // fetchNotifications() {
  //   this.notificationService.getUnread().subscribe(
  //     response => {
  //       this.notifications = response.data;
  //     }
  //   );
  // }

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


  toProfile() {
    this.router.navigate(['/poseidon/usuarios/profile/', this.authService.encryptData(this.userId)]);
  }

  toLocalities() {
    this.router.navigate(['/hercules/localities/list']);
  }

  toUsers() {
    this.router.navigate(['/hercules/users/list']);
  }

  toRoles() {
    this.router.navigate(['/hercules/roles/list']);
  }

  toPermissions() {
    this.router.navigate(['/hercules/permissions/list']);
  }

  redirectToHome() {
    this.router.navigate(['/hercules/home']);
  }
}
