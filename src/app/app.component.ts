import { Component } from '@angular/core';
import { LanguageService } from './services/language.service';
import { LucideAngularModule, Codepen, Building2, Mail, Languages } from 'lucide-angular';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ConfigurationService } from './services/poseidon-services/configuration.service';
import { AuthService } from './services/auth.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from './services/poseidon-services/notification.service';

interface MenuNode {
  name: string;
  icon?: string;
  path?: string;
  children?: MenuNode[];
  color?: string;
}

const TREE_DATA_OFF: MenuNode[] = [
  {
    name: 'Inicio',
    icon: 'home',
    path: '/',
  },
  {
    name: 'Nosotros',
    icon: 'factory',
    path: '/us',
  },
  {
    name: 'Aviso Legal',
    icon: 'heart-handshake',
    path: '/legal-warning',
  },
  {
    name: 'Contacto',
    icon: 'send-icon',
    path: '/contact',
  },
];

const TREE_DATA_POS: MenuNode[] = [
  {
    name: 'Inicio',
    icon: 'home',
    path: '/poseidon/home',
  },
  {
    name: 'Administración',
    icon: 'lucide-gantt-square',
    color: '#ffffff',
    children: [
      {
        name: 'Control usuarios',
        icon: 'chevron-right',
        color: '#ffffff',
        children: [
          {
            name: 'Usuarios',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/usuarios/list'
          },
          {
            name: 'Roles',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/roles/list'
          },
          {
            name: 'Permisos',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/permissions/list'
          }
        ],
      },
      {
        name: 'Control ubicación',
        icon: 'chevron-right',
        color: '#ffffff',
        children: [
          {
            name: 'Estados',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/department/list'
          },
          {
            name: 'Ciudades',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/city/list'
          },
          {
            name: 'Zonas',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/zone/list'
          }
        ],
      },
      {
        name: 'Control clientes',
        icon: 'chevron-right',
        color: '#ffffff',
        children: [
          {
            name: 'Cargos',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/occupation/list'
          },
          {
            name: 'Clientes',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/client/list'
          },
          {
            name: 'Tanques Estacionarios',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/stationary-tank/list'
          },
          {
            name: 'Establecimientos',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/branch-offices/list'
          },
        ],
      },
      {
        name: 'Control entregas',
        icon: 'chevron-right',
        color: '#ffffff',
        children: [
          {
            name: 'Pedidos',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/orders/list'
          },
          {
            name: 'Auto Tanques',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/propane-trucks/list'
          },
          {
            name: 'Derroteros',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/courses/admin'
          },
          {
            name: 'Servicios',
            color: '#ffffff',
            icon: 'dot',
            path: '/poseidon/request/list'
          },
        ],
      },
    ],
  },
  {
    name: 'Cuenta',
    icon: 'circle-user-round',
    color: '#ffffff',
    children: [
      {
        name: 'Perfil',
        icon: 'user',
        color: '#ffffff',
      },
      {
        name: 'Notificaciones',
        icon: 'bell',
        color: '#ffffff',
        path: '/poseidon/notifications/list'
      },
      {
        name: 'Cerrar Sesión',
        icon: 'log-out',
        color: '#e13411',
        path: 'logout',
      },
    ],
  }
];

const TREE_DATA_HER: MenuNode[] = [
  {
    name: 'Inicio',
    icon: 'home',
    path: '/hercules/home',
  },
  {
    name: 'Cuenta',
    icon: 'circle-user-round',
    color: '#ffffff',
    children: [
      {
        name: 'Perfil',
        icon: 'user',
        color: '#ffffff',
      },
      {
        name: 'Cerrar Sesión',
        icon: 'log-out',
        color: '#e13411',
        path: 'logout',
      },
    ],
  },
  {
    name: 'Administración',
    icon: 'lucide-gantt-square',
    color: '#ffffff',
    children: [
      {
        name: 'Control usuarios',
        icon: 'chevron-right',
        color: '#ffffff',
        children: [
          {
            name: 'Usuarios',
            color: '#ffffff',
            icon: 'dot',
            path: '/hercules/users/list'
          }
        ],
      },
      {
        name: 'Control plantas',
        icon: 'chevron-right',
        color: '#ffffff',
        children: [
          {
            name: 'Localidades',
            color: '#ffffff',
            icon: 'dot',
            path: '/hercules/localities/list'
          }
        ],
      }
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  icon?: string;
  path?: string;
  color?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private authSubscription!: Subscription;
  private subscription!: Subscription;
  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      icon: node.icon,
      path: node.path,
      color: node.color,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<MenuNode, ExampleFlatNode, ExampleFlatNode>(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  title = 'sistema_registros';
  menuActive = false;
  isMobile: boolean = false;
  language: string = 'es';
  configuration: any = {};
  isLogged: boolean = false;
  notifications: any;
  userId: any;
  system: any;
  logoSrc!: string;

  readonly Building2 = Building2;
  readonly Mail = Mail;
  readonly Languages = Languages;

  constructor(
    private languageService: LanguageService,
    private breakpointObserver: BreakpointObserver,
    private configurationService: ConfigurationService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });

    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLogged = isLoggedIn;
      this.updateMenu();
    });

    // Verificar el estado de autenticación al cargar la aplicación
    if (this.authService.isAuthenticated()) {
      this.isLogged = true;
      this.updateMenu();
    }
  }

  ngOnInit() {
    this.getLogoSrc();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  getConfigurationSheet() {
    try {
      if (!this.isLogged) {
        this.configuration = null;
        return;
      }

      switch (this.system) {
        case 'Poseidon':
          this.configurationService.getAll().subscribe(
            response => {
              if (response.statusCode == 200) {
                this.configuration = response.data[0];
              } else {
                this.router.navigate(['/poseidon/configuration']);
              }
            }
          );
          break;
        case 'Hercules':
          this.configuration = null;
          break;

        default:
          break; // No hacer nada
      }

    } catch (error) {
      this.toastr.error('No se pudo cargar la configuración del sistema');
    }
  }

  switchLanguage(language: string) {
    this.languageService.switchLanguage(language);
    this.language = language;
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  navigate(path: any) {
    if (path.charAt(0) === '/') {
      this.router.navigate([path]);
      this.toggleMenu();
    } else {
      const method = this[path as keyof AppComponent];
      if (typeof method === 'function') {
        (method as Function).call(this);
        this.toggleMenu();
      } else {
        console.error(`La función ${path} no existe en el componente.`);
      }
    }
  }

  private updateMenu() {
    this.getMenuColor();
    this.getLogoSrc();

    if (this.isLogged) {
      const tokenData = this.authService.getTokenData();
      this.system = tokenData.system;

      switch (tokenData.system) {
        case 'Poseidon':
          this.dataSource.data = TREE_DATA_POS;
          this.getConfigurationSheet();
          return;

        case 'Hercules':
          this.dataSource.data = TREE_DATA_HER;
          this.getConfigurationSheet();
          return;

        case 'Fenix':
          this.dataSource.data = TREE_DATA_HER;
          this.getConfigurationSheet();
          return;

        default:
          this.dataSource.data = TREE_DATA_OFF
          return;
      }

    } else {
      this.dataSource.data = TREE_DATA_OFF;
    }
  }

  getMenuColor(): string {
    const tokenData = this.authService.getTokenData();

    if (!tokenData) {
      return '#026ec1';
    }

    switch (tokenData.system) {
      case 'Poseidon':
        return tokenData.color;

      case 'Hercules':
        return tokenData.color;

      case 'Fenix':
        return tokenData.color;

      default:
        return '#026ec1';
    }
  }

  getLogoSrc() {
    const tokenData = this.authService.getTokenData();

    if (!tokenData) {
      this.logoSrc =  'assets/images/logonav.png';
      return;
    }
    
    switch (tokenData.system) {
      case 'Poseidon':
        this.logoSrc = 'assets/images/poseidon-logo.svg';
        break;

      case 'Hercules':
        this.logoSrc = 'assets/images/hercules-logo.svg';
        break;

      case 'Fenix':
        this.logoSrc = 'assets/images/fenix-logo.svg';
        break;

      default:
        this.logoSrc = 'assets/images/logonav.png';
        break;
    }
  }

  logout(): void {
    this.dialogService.openConfirmDialog('¿Estás seguro de cerrar la sesión?')
      .subscribe(result => {
        if (result) {
          this.authService.logout();
          this.router.navigate(['/']);
          this.toastr.info('Se ha cerrado la sesión');
          this.configuration = null;
        }
      });
  }

  // Métodos de navegación
  redirectToHome() {
    switch (this.system) {
      case 'Poseidon':
        this.router.navigate(['/poseidon/home']);
        break;

      case 'Hercules':
        this.router.navigate(['/hercules/home']);
        break;

      case 'Fenix':
        this.router.navigate(['/fenix/home']);
        break;

      default:
        this.router.navigate(['/']);
        break;
    }
  }

  redirectToLandingPage() {
    this.router.navigate(['/']);
  }

  toLegalWarning() {
    this.router.navigate(['/legal-warning']);
  }

  toUs() {
    this.router.navigate(['/us']);
  }

  toContact() {
    this.router.navigate(['/contact']);
  }

}
