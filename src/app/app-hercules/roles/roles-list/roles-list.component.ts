import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

// Servicios
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RolesService } from 'src/app/services/hercules-services/roles.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent {
  // Referencias de elementos del DOM y Angular Material
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('myInput') searchInput!: ElementRef;

  // Suscripciones
  private languageSubscription!: Subscription;

  // Paginación
  pageSizeOptions: number[] = [4, 8, 12];
  pageSize: number = 4;
  pageIndex: number = 0;

  // Datos
  roles: any[] = [];
  filteredRoles: any[] = [];
  isLoading = false;

  // Estadísticas globales
  roleStats = {
    total: 0,
    active: 0,
    inactive: 0
  };

  // Datos de visualización (gráficas o resumen)
  permissionDistribution: any[] = [];

  constructor(
    private router: Router,
    private rolesService: RolesService,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
  ) {
    // Configuración inicial de idiomas
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    // Verificación de permisos de lectura
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  ngOnInit(): void {
    this.fetchRoles(); // Carga inicial de datos
  }

  ngAfterViewInit(): void {
    // Escuchar cambios de paginador
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.onPageChange(event);
      });
    }
  }

  // 🔍 Filtro de búsqueda en tabla de roles
  initializeSearchFilter(): void {
    const value = this.searchInput.nativeElement.value.toLowerCase();
    if (!value) {
      this.filteredRoles = [...this.roles];
      return;
    }

    this.filteredRoles = this.roles.filter(role =>
      role.name.toLowerCase().includes(value) ||
      role.state.toLowerCase().includes(value) ||
      role.permissions.some((p: any) => p.name.toLowerCase().includes(value))
    );

    this.pageIndex = 0;
    if (this.paginator) this.paginator.firstPage();
  }

  // 📄 Cambio de página (paginador)
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // 🔄 Obtener todos los roles desde el servicio
  fetchRoles(): void {
    this.isLoading = true;
    this.rolesService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          this.roles = response.data;
          this.filteredRoles = [...this.roles];
          this.calculateRoleStatistics();
          this.calculatePermissionDistribution();
        } else {
          console.error('Error al obtener roles:', response.message);
        }
      },
      error => {
        this.isLoading = false;
        console.error('Error al obtener roles:', error);
      }
    );
  }

  // 📊 Calcular estadísticas de estado de los roles
  private calculateRoleStatistics(): void {
    this.roleStats = {
      total: this.roles.length,
      active: this.roles.filter(r => r.state === 'ACTIVO').length,
      inactive: this.roles.filter(r => r.state === 'INACTIVO').length
    };
  }

  // 🧠 Calcular distribución de permisos por nombre
  private calculatePermissionDistribution(): void {
    const permissionCountMap = new Map<string, number>();

    this.roles.forEach(role => {
      role.permissions.forEach((permission: any) => {
        const currentCount = permissionCountMap.get(permission.name) || 0;
        permissionCountMap.set(permission.name, currentCount + 1);
      });
    });

    this.permissionDistribution = Array.from(permissionCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4); // Mostrar solo los 4 más usados
  }

  // ⬆️ Ajustar paginación para mostrar todos los roles
  setPageSizeToTotal(): void {
    this.pageSize = this.filteredRoles.length;
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      this.paginator.pageIndex = 0;
    }
  }

  // 🚀 Acciones de usuario
  exportRoles(): void {
    this.toastr.info('Exportando roles...');
    // Aquí puedes implementar la lógica real de exportación
  }

  createNewRole(): void {
    this.router.navigate(['/hercules/roles/create']);
  }

  refreshRoles(): void {
    this.fetchRoles();
    this.toastr.success('Lista de roles actualizada');
  }

  showHistory(): void {
    this.toastr.info('Mostrando historial de cambios...');
    // Aquí puedes implementar la lógica real de historial
  }

  // 🔽 Ordenar tabla de roles por columna
  sortData(column: string): void {
    this.filteredRoles.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      if (column === 'state') {
        return valueA === 'ACTIVO' ? -1 : valueB === 'ACTIVO' ? 1 : 0;
      }

      return valueA.localeCompare(valueB);
    });
  }

  // 📍 Navegación
  toUsers(): void {
    this.router.navigate(['/hercules/users/list']);
  }

  toPermissions(): void {
    this.router.navigate(['/hercules/permissions/list']);
  }

  toHome(): void {
    this.router.navigate(['/hercules/home']);
  }
}
