import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { NotificationService } from 'src/app/services/poseidon-services/notification.service';
import { LucideAngularModule, Codepen, Building2, Mail, Languages } from 'lucide-angular';
import { DialogService } from 'src/app/services/dialog.service';
import { ConfigurationService } from 'src/app/services/poseidon-services/configuration.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-poseidon',
  templateUrl: './menu-poseidon.component.html',
  styleUrls: ['./menu-poseidon.component.scss']
})
export class MenuPoseidonComponent {

  notifications: any[] = [];
  userId: any;
  language: string = 'es';
  isLogged: boolean = false;
  sidebarCollapsed = false;
  configuration: any;
  readonly Languages = Languages;
  collapsed = true;
  private menuSub!: Subscription;
  showNotifyMenu = false;
  showAdminMenu = false;
  showUsersMenu = false;
  showUbicationMenu = false;
  showClientsMenu = false;
  showMaquinariaMenu = false;
  showAccountMenu = false;
  showLangMenu = false;
  dropdownOpen = false;
  activeSubMenu: string | null = null;
  isMobileScreen: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private configurationService: ConfigurationService
  ) {
    this.authService.menuExpanded$.subscribe(expanded => {
      this.sidebarCollapsed = expanded;
    });
  }

  ngOnInit() {
    this.checkScreenSize();

    this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
      this.collapsed = expanded;
    });

    window.addEventListener('resize', this.checkScreenSize.bind(this));

    this.loadNotifications();
  }

  checkScreenSize() {
    const isMobile = window.innerWidth < 768;
    this.isMobileScreen = isMobile; // ✅ Asegura que se actualice correctamente
    this.sidebarCollapsed = !isMobile ? this.sidebarCollapsed : false;
  }

  ngOnChanges(): void {
    this.sidebarCollapsed = this.authService.getMenuExpanded();
    console.log('Sidebar collapsed:', this.sidebarCollapsed);
  }

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

  // ✅ MODIFICADO para redirigir directamente si es móvil
  toggleNotifyMenu() {
    if (this.isMobileScreen) {
      this.toNotifications();
      return;
    }

    if (this.showNotifyMenu) {
      this.showNotifyMenu = false;
      return;
    }

    this.closeAllMenus();
    this.showNotifyMenu = true;
    this.fetchNotifications();
  }

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

  toggleAdminMenu() {
    this.showAdminMenu = !this.showAdminMenu;
    if (!this.showAdminMenu) {
      this.activeSubMenu = null;
    }
  }

  toggleSubMenu(subMenu: string) {
    this.activeSubMenu = this.activeSubMenu === subMenu ? null : subMenu;
  }

  toggleAccountMenu() {
    if (this.showAccountMenu) {
      this.showAccountMenu = false;
      return;
    }
    this.closeAllMenus();
    this.showAccountMenu = true;
  }

  toggleLangMenu() {
    if (this.showLangMenu) {
      this.showLangMenu = false;
      return;
    }
    this.closeAllMenus();
    this.showLangMenu = true;
  }

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

  switchLanguage(language: string) {
    this.languageService.switchLanguage(language);
    this.language = language;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
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

  //////////////////////// Rutas ////////////////////////////

  toRoles() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/roles/list']));
  }

  toPermissions() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/permissions/list']));
  }

  toUsers() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/usuarios/list']));
  }

  toClients() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/client/list']));
  }

  toDepartments() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/department/list']));
  }

  toCities() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/city/list']));
  }

  toZones() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/zone/list']));
  }

  toBranchOffices() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/branch-offices/list']));
  }

  toOccupations() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/occupation/list']));
  }

  toFactor() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/factor/list']));
  }

  toCourses() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/courses/admin']));
  }

  toPropaneTrucks() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/propane-trucks/list']));
  }

  toOrders() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/orders/list']));
  }

  toRequest() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/request/list']));
  }

  toStationaryTanks() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/stationary-tank/list']));
  }

  toTablets() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/tablets/list']));
  }

  toProfile() {
    this.router.navigate(['/poseidon/usuarios/profile/', this.authService.encryptData(this.userId)]);
  }

  toNotifications() {
    this.redirectIfAuthorized(() => this.router.navigate(['/poseidon/notifications/list']));
  }

  redirectToHome() {
    this.router.navigate(['/poseidon/home']);
  }

  private redirectIfAuthorized(action: () => void) {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        action();
      }
    });
  }
}
