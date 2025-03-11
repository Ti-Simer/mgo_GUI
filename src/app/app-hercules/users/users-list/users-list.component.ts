import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/hercules-services/user.service';
import { LanguageService } from 'src/app/services/language.service';
import { DialogEditUsersComponent } from '../dialog-edit-users/dialog-edit-users.component';
import { DialogCreateUsersComponent } from '../dialog-create-users/dialog-create-users.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  users: any[] = [];
  isLoading = false;

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

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
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

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.findAll().subscribe(
      (response) => {
        this.isLoading = false;
        this.users = response.data; // Asigna la respuesta a la variable de usuarios
      },
      (error) => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.users.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.users.sort((a: any, b: any) => {
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

  deleteUser(user: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
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
                (error) => {
                  this.toastr.error('Error al desactivar usuario', 'Error');
                }
              );
            }
          });
      }
    });
  }

  activateUser(user: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
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
                (error) => {
                  this.toastr.error('Error al activar usuario', 'Error');
                }
              );
            }
          });
      }
    });
  }

  toCreateUser() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateUsersComponent, {
          width: '700px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchUsers();
        });
      }
    });
  }

  toEditUser(user: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditUsersComponent, {
          width: '600px',
          data: { userId: user.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchUsers();
        });
      }
    });
  }

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
