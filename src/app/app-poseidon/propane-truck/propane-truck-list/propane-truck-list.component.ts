import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { PropaneTruckService } from 'src/app/services/poseidon-services/propane-truck.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreatePropaneTruckComponent } from '../dialog-create-propane-truck/dialog-create-propane-truck.component';
import { DialogEditPropaneTruckComponent } from '../dialog-edit-propane-truck/dialog-edit-propane-truck.component';

@Component({
  selector: 'app-propane-truck-list',
  templateUrl: './propane-truck-list.component.html',
  styleUrls: ['./propane-truck-list.component.scss']
})
export class PropaneTruckListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  propaneTrucks: any[] = [];
  isLoading = false;

  public Math = Math;
  collapsed = true;
  private menuSub!: Subscription;

  constructor(
    private authService: AuthService,
    private propaneTruckService: PropaneTruckService,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  ngOnInit(): void {
    this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
      this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
    });

    this.fetchPropaneTrucks();

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

  ngOnDestroy(): void {
    this.menuSub?.unsubscribe();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.propaneTrucks.length / this.pageSize));
  }

  onPageSizeChange() {
    this.pageIndex = 0;
  }

  goToPage(page: number) {
    if (page < 0) page = 0;
    if (page > this.totalPages - 1) page = this.totalPages - 1;
    this.pageIndex = page;
  }

  fetchPropaneTrucks() {
    this.isLoading = true;
    this.propaneTruckService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.propaneTrucks = response.data;
        } else {
          this.toastr.info('No se han encontrado Auto Tanques')
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar los Auto Tanques ${error}`);
      }
    );
  }

  deletePropaneTruck(propaneTruck: any) {
    if (propaneTruck.status === 'EN CURSO') {
      this.toastr.warning('No se puede editar un Auto Tanque en curso', 'Advertencia');
    } else {
      this.authService.editChecker().subscribe(flag => {
        if (!flag) {
          this.toastr.warning('No tienes permisos para editar');
        } else {
          this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar el Auto Tanque ${propaneTruck.plate}?`)
            .subscribe(result => {
              if (result) {
                this.propaneTruckService.delete(propaneTruck.id).subscribe(
                  (response) => {
                    if (response.statusCode === 200) {
                      this.toastr.success(`Auto Tanque ${propaneTruck.name} eliminado exitosamente`, 'Éxito');
                      this.fetchPropaneTrucks();
                    } else {
                      this.toastr.error('Error al eliminar Auto Tanque', response.message);
                    }
                  },
                  (error) => {
                    this.toastr.error('Error al eliminar Auto Tanque', 'Error');
                  }
                );
              }
            });
        }
      });
    }
  }

  activatePropaneTruck(propaneTruck: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        this.dialogService.openConfirmDialog(`¿Estás seguro de activar el Auto Tanque ${propaneTruck.plate}?`)
          .subscribe(result => {
            if (result) {
              this.propaneTruckService.activate(propaneTruck.id).subscribe(
                (response) => {
                  if (response.statusCode === 200) {
                    this.toastr.success(`Auto Tanque ${propaneTruck.name} activado exitosamente`, 'Éxito');
                    this.fetchPropaneTrucks();
                  } else {
                    this.toastr.error('Error al activar Auto Tanque', response.message);
                  }
                },
                (error) => {
                  this.toastr.error('Error al activar Auto Tanque', 'Error');
                }
              );
            }
          });
      }
    });
  }

  setPageSizeToTotal() {
    this.pageSize = this.propaneTrucks.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.propaneTrucks.sort((a: any, b: any) => {
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

  toEditPropaneTruck(propaneTruck: any) {
    if (propaneTruck.status === 'EN CURSO') {
      this.toastr.warning('No se puede editar un Auto Tanque en curso', 'Advertencia');
    } else {
      this.authService.editChecker().subscribe(flag => {
        if (!flag) {
          this.toastr.warning('No tienes permisos para editar');
        } else {
          const dialogRef = this.dialog.open(DialogEditPropaneTruckComponent, {
            width: '750px',
            data: { propaneTruckId: propaneTruck.id }
          });

          dialogRef.afterClosed().subscribe(result => {
            this.fetchPropaneTrucks();
          });
        }
      });
    }
  }

  toCreatePropaneTruck() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreatePropaneTruckComponent, {
          width: '750px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchPropaneTrucks();
        });
      }
    });
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }

}
