import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RolesService } from 'src/app/services/poseidon-services/roles.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogCreateRolesComponent } from '../dialog-create-roles/dialog-create-roles.component';
import { DialogEditRolesComponent } from '../dialog-edit-roles/dialog-edit-roles.component';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  public Math = Math;
  collapsed = true;
  private menuSub!: Subscription;

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  roles: any[] = [];
  isLoading = false;
  permissions: any;

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
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  ngOnInit(): void {
    this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
      this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
    });

    this.fetchRoles();
    
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }
  }

  // Método para manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.onPageChange(event);
      });

      this.initializeSearchFilter();
    }
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

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.roles.length / this.pageSize));
  }

  onPageSizeChange() {
    this.pageIndex = 0;
  }

  goToPage(page: number) {
    if (page < 0) page = 0;
    if (page > this.totalPages - 1) page = this.totalPages - 1;
    this.pageIndex = page;
  }

  fetchRoles(): void {
    this.isLoading = true;
    this.rolesService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          this.roles = response.data;

        } else {
          console.error('Error al obtener roles:', response.message);
        }
      },
      error => {
        console.error('Error al obtener roles:', error);
      }
    );
  }

  deleteRole(rol: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar el rol de ${rol.name} ?`)
          .subscribe(result => {
            if (result) {
              this.rolesService.delete(rol.id).subscribe(
                (response) => {
                  if (response.statusCode === 200) {
                    this.toastr.success('Rol eliminado exitosamente', 'Éxito');
                    this.fetchRoles();
                  } else {
                    this.toastr.error('Error al eliminar rol', response.message);
                  }
                },
                (error) => {
                  this.toastr.error('Error al eliminar rol', 'Error');
                }
              );
            }
          });
      }
    });
  }

  setPageSizeToTotal() {
    this.pageSize = this.roles.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.roles.sort((a: any, b: any) => {
      let valueA = a;
      let valueB = b;

      // Navega a través de las claves para obtener el valor final
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

      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0; // Los valores son iguales
    });
  }

  toEditRole(role: any) {
    const dialogRef = this.dialog.open(DialogEditRolesComponent, {
      width: '600px',
      data: { roleId: role.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchRoles();
    });
  }

  toCreateRoles() {
    const dialogRef = this.dialog.open(DialogCreateRolesComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchRoles();
    });
  }

  toUsers() {
    this.router.navigate(['/poseidon/usuarios/list'])
  }

  toPermissions() {
    this.router.navigate(['/poseidon/permissions/list'])
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }

}
