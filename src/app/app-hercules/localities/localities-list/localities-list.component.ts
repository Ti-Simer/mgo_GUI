import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { LocalitiesService } from 'src/app/services/hercules-services/localities.service';
import { AuthService } from 'src/app/services/auth.service';

import { DialogCreateLocalitiesComponent } from '../dialog-create-localities/dialog-create-localities.component';
import { DialogEditLocalitiesComponent } from '../dialog-edit-localities/dialog-edit-localities.component';

@Component({
  selector: 'app-localities-list',
  templateUrl: './localities-list.component.html',
  styleUrls: ['./localities-list.component.scss']
})
export class LocalitiesListComponent {

  // Referencias al DOM
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('myInput') searchInput!: ElementRef;

  // Datos de paginación
  pageSizeOptions: number[] = [25, 50, 100];
  pageSize: number = 25;
  pageIndex: number = 0;

  // Datos de localidades
  localities: any[] = [];              // Lista completa
  originalLocalities: any[] = [];      // Copia sin filtrar
  filteredLocalities: any[] = [];      // Lista filtrada por búsqueda

  // Estados
  isLoading: boolean = false;
  showAll: boolean = false;

  constructor(
    private localitiesService: LocalitiesService,
    private toastr: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchLocalities(); // Carga inicial de localidades
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.onPageChange(event); // Escucha cambios de página
      });
    }

    this.initializeSearchFilter(); // Habilita búsqueda dinámica
  }

  // ===================== MÉTODOS PRINCIPALES ======================

  // Carga las localidades desde el servicio
  fetchLocalities() {
    this.isLoading = true;

    this.localitiesService.findAll().subscribe((response: any) => {
      this.isLoading = false;

      if (response.statusCode === 200) {
        this.localities = response.data;
        this.originalLocalities = [...response.data];
        this.filteredLocalities = [...response.data];
      }
    });
  }

  // Crea una nueva localidad mediante modal
  toCreateLocalities() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
        return;
      }

      const dialogRef = this.dialog.open(DialogCreateLocalitiesComponent, {
        width: '800px'
      });

      dialogRef.afterClosed().subscribe(() => {
        this.fetchLocalities(); // Recargar después de cerrar
      });
    });
  }

  // Edita una localidad existente
  toEditLocality(locality: any) {
    const datos = {
      localityId: locality.id,
      imei: locality.devices?.imei
    };

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
        return;
      }

      const dialogRef = this.dialog.open(DialogEditLocalitiesComponent, {
        width: '1400px',
        data: datos
      });

      dialogRef.afterClosed().subscribe(() => {
        this.fetchLocalities();
      });
    });
  }

  // ===================== BÚSQUEDA Y FILTRADO ======================

  // Habilita búsqueda en el input
  initializeSearchFilter() {
    if (!this.searchInput) return;

    const inputElement = this.searchInput.nativeElement as HTMLInputElement;

    inputElement.addEventListener('input', () => {
      const value = inputElement.value.toLowerCase();

      if (value) {
        this.filteredLocalities = this.originalLocalities.filter(locality =>
          locality.name.toLowerCase().includes(value) ||
          (locality.parent_id?.name?.toLowerCase().includes(value)) ||
          (locality.devices?.imei?.toLowerCase().includes(value))
        );
      } else {
        this.filteredLocalities = [...this.originalLocalities];
      }

      this.paginator.firstPage(); // Reinicia paginador
    });
  }

  // Ordena los datos por propiedad anidada (ej: 'parent_id.name')
  sortData(data: string) {
    const keys = data.split('.');

    this.filteredLocalities.sort((a: any, b: any) => {
      let valueA = a;
      let valueB = b;

      keys.forEach(key => {
        if (key.includes('[')) {
          const [arrayKey, index] = key.split(/[\[\]]/).filter(Boolean);
          valueA = valueA[arrayKey][index];
          valueB = valueB[arrayKey][index];
        } else {
          valueA = valueA?.[key];
          valueB = valueB?.[key];
        }
      });

      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
  }

  // ===================== PAGINACIÓN ======================

  // Maneja el cambio de página
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.showAll = false;
  }

  // Muestra todos los registros sin paginar
  setPageSizeToTotal() {
    if (!this.paginator) return;

    this.showAll = true;
    this.pageSize = this.localities.length;
    this.pageIndex = 0;
    this.paginator.pageSize = this.localities.length;
    this.paginator.pageIndex = 0;
  }

  // Retorna las localidades para mostrar en la página actual
  getLocalitiesToShow() {
    if (this.showAll) return this.filteredLocalities;

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredLocalities.slice(startIndex, endIndex);
  }

  // ===================== MÉTODOS FUTUROS ======================

  deleteCity(item: any) {
    // Lógica para desactivar ciudad (pendiente)
  }

  activteCity(item: any) {
    // Lógica para activar ciudad (pendiente)
  }
}
