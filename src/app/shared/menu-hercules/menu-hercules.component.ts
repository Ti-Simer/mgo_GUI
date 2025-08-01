import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { NotificationService } from 'src/app/services/poseidon-services/notification.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ConfigurationService } from 'src/app/services/poseidon-services/configuration.service';
import { Subscription } from 'rxjs';
import { Languages } from 'lucide-angular';

@Component({
  selector: 'app-menu-hercules',
  templateUrl: './menu-hercules.component.html',
  styleUrls: ['./menu-hercules.component.scss']
})
export class MenuHerculesComponent {

  // Variables generales
  notifications: any[] = [];        // Lista de notificaciones sin leer
  userId: any;                      // ID del usuario autenticado
  language: string = 'es';          // Idioma por defecto
  isLogged: boolean = false;        // Estado de sesión
  configuration: any;              // Configuración general del sistema
  readonly Languages = Languages;   // Icono de idiomas
  collapsed = true;                 // Estado del sidebar
  private menuSub!: Subscription;   // Suscripción al estado del menú

  // Estados de submenús
  showNotifyMenu = false;
  showAdminMenu = false;
  showUsersMenu = false;
  showUbicationMenu = false;
  showClientsMenu = false;
  showMaquinariaMenu = false;
  showAccountMenu = false;
  showLangMenu = false;

  // Otros controles de UI
  dropdownOpen = false;
  activeSubMenu: string | null = null;
  isMobileScreen: boolean = false;
  sidebarCollapsed = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private configurationService: ConfigurationService
  ) {
    // Suscripción al estado del menú desde el AuthService
    this.authService.menuExpanded$.subscribe(expanded => {
      this.sidebarCollapsed = expanded;
    });
  }

  ngOnInit() {
    this.checkScreenSize(); // Ajustar según el tamaño de pantalla

    // Suscripción para colapsar/expandir menú desde AuthService
    this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
      this.collapsed = expanded;
    });

    // Escuchar cambios de tamaño de pantalla
    window.addEventListener('resize', this.checkScreenSize.bind(this));

    this.loadNotifications(); // Cargar notificaciones al iniciar
  }

  // Detectar si estamos en pantalla móvil
  checkScreenSize() {
    const isMobile = window.innerWidth < 768;
    this.isMobileScreen = isMobile;
    this.sidebarCollapsed = !isMobile ? this.sidebarCollapsed : false;
  }

  // (Opcional) Cuando se detectan cambios en el componente
  ngOnChanges(): void {
    this.sidebarCollapsed = this.authService.getMenuExpanded();
    console.log('Sidebar collapsed:', this.sidebarCollapsed);
  }

  // Obtener notificaciones no leídas
  loadNotifications(): void {
    this.notificationService.getUnread().subscribe(
      response => {
        this.notifications = response.data || [];
      },
      error => {
        console.error('Error al obtener notificaciones:', error);
      }
    );
  }

  // Alternar menú de notificaciones
  toggleNotifyMenu() {
    if (this.isMobileScreen) {
      this.toNotifications(); // Redirige directamente en móviles
      return;
    }

    if (this.showNotifyMenu) {
      this.showNotifyMenu = false;
      return;
    }

    this.closeAllMenus();
    this.showNotifyMenu = true;
    this.fetchNotifications(); // Actualiza lista
  }

  // Volver a cargar notificaciones
  fetchNotifications() {
    this.notificationService.getUnread().subscribe(
      response => {
        this.notifications = response.data || [];
      },
      error => {
        console.error('Error al obtener notificaciones:', error);
      }
    );
  }

  // Alternar menú de administración principal
  toggleAdminMenu() {
    this.showAdminMenu = !this.showAdminMenu;
    if (!this.showAdminMenu) {
      this.activeSubMenu = null;
    }
  }

  // Controla submenús individuales dentro de administración
  toggleSubMenu(subMenu: string) {
    this.activeSubMenu = this.activeSubMenu === subMenu ? null : subMenu;
  }

  // Mostrar menú de cuenta
  toggleAccountMenu() {
    if (this.showAccountMenu) {
      this.showAccountMenu = false;
      return;
    }
    this.closeAllMenus();
    this.showAccountMenu = true;
  }

  // Mostrar menú de idiomas
  toggleLangMenu() {
    if (this.showLangMenu) {
      this.showLangMenu = false;
      return;
    }
    this.closeAllMenus();
    this.showLangMenu = true;
  }

  // Cierra todos los submenús
  closeAllMenus() {
    this.showNotifyMenu = false;
    this.showAdminMenu = false;
    this.showUsersMenu = false;
    this.showUbicationMenu = false;
    this.showClientsMenu = false;
    this.showMaquinariaMenu = false;
    this.showAccountMenu = false;
    this.showLangMenu = false;
  }

  // Cambiar idioma de la app
  switchLanguage(language: string) {
    this.languageService.switchLanguage(language);
    this.language = language;
  }

  // Abrir/cerrar dropdown manualmente
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Cierra sesión del usuario
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

  // Carga la hoja de configuración general del sistema
  getConfigurationSheet() {
    try {
      if (!this.isLogged) return;

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

  // Verifica permisos antes de redirigir
  private redirectIfAuthorized(action: () => void) {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        action();
      }
    });
  }

  ////////////////////// RUTAS DEL MENÚ //////////////////////

  toProfile() {
    this.router.navigate([
      '/poseidon/usuarios/profile/',
      this.authService.encryptData(this.userId)
    ]);
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

  toNotifications() {
    this.redirectIfAuthorized(() => this.router.navigate(['/hercules/notifications']));
  }

}
