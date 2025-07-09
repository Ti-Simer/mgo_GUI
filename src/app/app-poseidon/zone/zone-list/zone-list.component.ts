import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ZoneService } from 'src/app/services/poseidon-services/zone.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogCreateZoneComponent } from '../dialog-create-zone/dialog-create-zone.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditZoneComponent } from '../dialog-edit-zone/dialog-edit-zone.component';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss']
})
export class ZoneListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  zones: any[] = [];
  isLoading = false;
  public Math = Math;

  collapsed = true;
  private menuSub!: Subscription;


  constructor(
    private authService: AuthService,
    private router: Router,
    private zoneService: ZoneService,
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
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  ngOnInit(): void {
    this.fetchZones();

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
    return Math.max(1, Math.ceil(this.zones.length / this.pageSize));
  }

  onPageSizeChange() {
    this.pageIndex = 0;
  }

  goToPage(page: number) {
    if (page < 0) page = 0;
    if (page > this.totalPages - 1) page = this.totalPages - 1;
    this.pageIndex = page;
  }

  fetchZones() {
    this.isLoading = true;
    this.zoneService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.zones = response.data;
        } else {
          this.toastr.info('No se han creado zonas');
        }
      }, (error) => {
        this.toastr.error('Ha ocurrido un error al consultar las zonas: ', error);
      }
    );
  }

  deleteZone(zone: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar la zona ${zone.name} ?`)
          .subscribe(result => {
            if (result) {
              this.zoneService.delete(zone.id).subscribe(
                (response) => {
                  if (response.statusCode === 200) {
                    this.toastr.success(`zona ${zone.name} eliminada exitosamente`, 'Éxito');
                    this.fetchZones();
                  } else {
                    this.toastr.error('Error al eliminar la zona', response.message);
                  }
                },
                (error) => {
                  this.toastr.error('Error al eliminar la zona', 'Error');
                }
              );
            }
          });
      }
    });
  }

  setPageSizeToTotal() {
    this.pageSize = this.zones.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.zones.sort((a: any, b: any) => {
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

  toCreateZone() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateZoneComponent, {
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchZones();
        });
      }
    });
  }

  toEditZone(zone: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditZoneComponent, {
          width: '600px',
          data: { zoneId: zone.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchZones();
        });
      }
    });
  }

  toCities() {
    this.router.navigate(['/poseidon/city/list'])
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }


}
