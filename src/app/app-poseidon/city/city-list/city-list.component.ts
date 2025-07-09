import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CityService } from 'src/app/services/poseidon-services/city.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DepartmentService } from 'src/app/services/poseidon-services/department.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogCreateCityComponent } from '../dialog-create-city/dialog-create-city.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditCityComponent } from '../dialog-edit-city/dialog-edit-city.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  cities: any[] = [];
  isLoading = false;
  public Math = Math;

  collapsed = true;
  private menuSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cityService: CityService,
    private departmentService: DepartmentService,
    private toastr: ToastrService,
    private dialogService: DialogService,
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
    this.fetchCities();

    this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
      this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
    });

    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }
  }

  ngOnDestroy(): void {
    this.menuSub?.unsubscribe();
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
    return Math.max(1, Math.ceil(this.cities.length / this.pageSize));
  }

  onPageSizeChange() {
    this.pageIndex = 0;
  }

  goToPage(page: number) {
    if (page < 0) page = 0;
    if (page > this.totalPages - 1) page = this.totalPages - 1;
    this.pageIndex = page;
  }

  fetchCities() {
    this.isLoading = true;
    this.cityService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.cities = response.data;
        }
      }, (error) => {
        console.error('Ha ocurrido un consultar las ciudades');
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.cities.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.cities.sort((a: any, b: any) => {
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

  deleteCity(city: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        this.dialogService.openConfirmDialog(`¿Estás seguro de desactivar la ciudad de ${city.name} ?`)
          .subscribe(result => {
            if (result) {
              this.cityService.delete(city.id).subscribe(
                (response) => {
                  if (response.statusCode === 200) {
                    this.toastr.success(`Ciudad ${city.name} desactivada exitosamente`, 'Éxito');
                    this.fetchCities();
                  } else {
                    this.toastr.error('Error al desactivar la Ciudad', response.message);
                  }
                },
                (error) => {
                  this.toastr.error('Error al desactivar la Ciudad: ', error);
                }
              );
            }
          });
      }
    });
  }

  activteCity(city: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        this.dialogService.openConfirmDialog(`¿Estás seguro de activar la ciudad de ${city.name} ?`)
          .subscribe(result => {
            if (result) {
              this.cityService.activate(city.id).subscribe(
                (response) => {
                  if (response.statusCode === 200) {
                    this.toastr.success(`Ciudad ${city.name} activada exitosamente`, 'Éxito');
                    this.fetchCities();
                  } else {
                    this.toastr.error('Error al activar la Ciudad', response.message);
                  }
                },
                (error) => {
                  this.toastr.error('Error al activar la Ciudad: ', error);
                }
              );
            }
          });
      }
    });
  }

  toCreateCity() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateCityComponent, {
          width: '750px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchCities();
        });
      }
    });
  }

  toEditCity(city: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditCityComponent, {
          width: '750px',
          data: { cityId: city.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchCities();
        });
      }
    });
  }

  toDepartments() {
    this.router.navigate(['/poseidon/department/list']);
  }

  toZones() {
    this.router.navigate(['/poseidon/zone/list']);
  }

  toHome() {
    this.router.navigate(['/poseidon/home']);
  }

}


