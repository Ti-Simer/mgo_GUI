import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { LocalitiesService } from 'src/app/services/hercules-services/localities.service';
import { DialogCreateLocalitiesComponent } from '../dialog-create-localities/dialog-create-localities.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditLocalitiesComponent } from '../dialog-edit-localities/dialog-edit-localities.component';

@Component({
  selector: 'app-localities-list',
  templateUrl: './localities-list.component.html',
  styleUrls: ['./localities-list.component.scss']
})
export class LocalitiesListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda


  localities: any[] = [];

  isLoading = false;

  constructor(
    private localitiesService: LocalitiesService,
    private toastr: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchLocalities();

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

  fetchLocalities() {
    this.isLoading = true;
    this.localitiesService.findAll().subscribe((response: any) => {
      this.isLoading = false;
      if (response.statusCode == 200) {
        this.localities = response.data;
      }
    });
  }

  setPageSizeToTotal() { }
  toDepartments() { }
  toZones() { }

  toCreateLocalities() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateLocalitiesComponent, {
          width: '800px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchLocalities();
        });
      }
    });
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.localities.sort((a: any, b: any) => {
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

  toEditLocality(locality: any) {
    let datos = {};

    if (locality.devices) {
      datos = {
        imei: locality.devices.imei,
        localityId: locality.id,
      };
    } else {
      datos = {
        localityId: locality.id,
      };
    }

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditLocalitiesComponent, {
          width: '1400px',
          data: datos,
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchLocalities();
        });
      }
    });
  }

  deleteCity(item: any) { }
  activteCity(item: any) { }
}
