import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

// Servicios
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/hercules-services/user.service';
import { LanguageService } from 'src/app/services/language.service';

// Diálogos
import { DialogEditUsersComponent } from '../dialog-edit-users/dialog-edit-users.component';
import { DialogCreateUsersComponent } from '../dialog-create-users/dialog-create-users.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  // =======================
  // Properties & Decorators
  // =======================

  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('myInput') searchInput!: ElementRef;

  users: any[] = [];
  isLoading = false;
  sidebarCollapsed = false;

  pageSizeOptions: number[] = [25, 50, 100];
  pageSize = 25;
  pageIndex = 0;

  // ================
  // Constructor
  // ================
  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    // Verificar permisos de lectura
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  // ======================
  // Lifecycle Methods
  // ======================

  ngOnInit(): void {
    this.fetchUsers();

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.authService.menuExpanded$.subscribe(expanded => {
          this.sidebarCollapsed = expanded;
        });
      });
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.onPageChange(event);
      });

      this.initializeSearchFilter();
    }
  }

  // ======================
  // Data Fetching & Search
  // ======================

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.findAll().subscribe(
      (response) => {
        this.isLoading = false;
        this.users = response.data;
      },
      (error) => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
  }

  initializeSearchFilter() {
    if (this.searchInput) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#myTable tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  // ====================
  // Utilidades
  // ====================

  getUserInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getActiveUsersCount(): number {
    return this.users.filter(user => user.state === 'ACTIVO').length;
  }

  getInactiveUsersCount(): number {
    return this.users.filter(user => user.state === 'INACTIVO').length;
  }

  getRoleDistribution(): any[] {
    const roleCounts: { [key: string]: number } = {};
    const colors = ['#075985', '#10b981', '#f59e0b', '#8b5cf6'];
    let colorIndex = 0;

    this.users.forEach(user => {
      if (user.role?.name) {
        const roleName = user.role.name;
        roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
      }
    });

    const totalUsers = this.users.length;
    return Object.keys(roleCounts).map(roleName => {
      const count = roleCounts[roleName];
      const percentage = totalUsers > 0 ? (count / totalUsers) * 100 : 0;

      return {
        name: roleName,
        count,
        percentage,
        color: colors[colorIndex++ % colors.length]
      };
    });
  }

  exportToCSV() {
    const headers = ['Nombre', 'Apellido', 'Email', 'Tipo de Usuario', 'Estado', 'ID'];
    const data = this.users.map(user => [
      user.firstName,
      user.lastName,
      user.email,
      user.role?.name || '',
      user.state,
      user.idNumber
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\r\n';
    data.forEach(row => csvContent += row.join(',') + '\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'usuarios.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  setPageSizeToTotal() {
    this.pageSize = this.users.length;
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  sortData(path: string) {
    const keys = path.split('.');
    this.users.sort((a: any, b: any) => {
      let valueA = a;
      let valueB = b;

      keys.forEach(key => {
        if (key.includes('[')) {
          const [arrayKey, index] = key.split(/[\[\]]/).filter(Boolean);
          valueA = valueA[arrayKey][index];
          valueB = valueB[arrayKey][index];
        } else {
          valueA = valueA[key];
          valueB = valueB[key];
        }
      });

      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });
  }

  // ====================
  // Acciones CRUD
  // ====================

  deleteUser(user: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
        return;
      }

      this.dialogService.openConfirmDialog(`¿Estás seguro de desactivar al usuario ${user.firstName} ${user.lastName}?`)
        .subscribe(result => {
          if (result) {
            this.userService.deleteUser(user.id).subscribe(
              (response) => {
                if (response.statusCode === 200) {
                  this.toastr.success('Usuario desactivado exitosamente', 'Éxito');
                  this.fetchUsers();
                } else {
                  this.toastr.error('Error al desactivar usuario', response.message);
                }
              },
              () => this.toastr.error('Error al desactivar usuario', 'Error')
            );
          }
        });
    });
  }

  activateUser(user: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
        return;
      }

      this.dialogService.openConfirmDialog(`¿Estás seguro de activar al usuario ${user.firstName} ${user.lastName}?`)
        .subscribe(result => {
          if (result) {
            this.userService.activateUser(user.id).subscribe(
              (response) => {
                if (response.statusCode === 200) {
                  this.toastr.success('Usuario activado exitosamente', 'Éxito');
                  this.fetchUsers();
                } else {
                  this.toastr.error('Error al activar usuario', response.message);
                }
              },
              () => this.toastr.error('Error al activar usuario', 'Error')
            );
          }
        });
    });
  }

  toCreateUser() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
        return;
      }

      const dialogRef = this.dialog.open(DialogCreateUsersComponent, { width: '700px' });
      dialogRef.afterClosed().subscribe(() => this.fetchUsers());
    });
  }

  toEditUser(user: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
        return;
      }

      const dialogRef = this.dialog.open(DialogEditUsersComponent, {
        width: '600px',
        data: { userId: user.id }
      });
      dialogRef.afterClosed().subscribe(() => this.fetchUsers());
    });
  }

  // ====================
  // Navegación
  // ====================

  toViewUser(id: any) {
    this.router.navigate(['/hercules/usuarios/view/', this.authService.encryptData(id)]);
  }

  toHome() {
    this.router.navigate(['/hercules/home']);
  }

  toRoles() {
    this.router.navigate(['/hercules/roles/list']);
  }
}
