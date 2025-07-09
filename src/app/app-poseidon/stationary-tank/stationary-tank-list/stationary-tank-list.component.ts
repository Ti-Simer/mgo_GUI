import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MatPaginator } from '@angular/material/paginator';
import { StationaryTankService } from 'src/app/services/poseidon-services/stationary-tank.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogEditStationaryTankComponent } from '../dialog-edit-stationary-tank/dialog-edit-stationary-tank.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateStationaryTankComponent } from '../dialog-create-stationary-tank/dialog-create-stationary-tank.component';

@Component({
  selector: 'app-stationary-tank-list',
  templateUrl: './stationary-tank-list.component.html',
  styleUrls: ['./stationary-tank-list.component.scss']
})
export class StationaryTankListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  stationaryTanks: any[] = [];
  isLoading = false;

  public Math = Math;
  collapsed = true;
  private menuSub!: Subscription;

  constructor(
    private authService: AuthService,
    private stationaryTankService: StationaryTankService,
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
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  ngOnInit(): void {
    this.fetchStationaryTanks();

    this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
      this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
    });

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
    return Math.max(1, Math.ceil(this.stationaryTanks.length / this.pageSize));
  }

  onPageSizeChange() {
    this.pageIndex = 0;
  }

  goToPage(page: number) {
    if (page < 0) page = 0;
    if (page > this.totalPages - 1) page = this.totalPages - 1;
    this.pageIndex = page;
  }

  fetchStationaryTanks() {
    this.isLoading = true;
    this.stationaryTankService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.stationaryTanks = response.data;
        } else {
          this.toastr.info('No se han encontrado Tanques estacionarios')
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar los Tanques estacionarios ${error}`);
      }
    );
  }

  deleteStationaryTank(propaneTruck: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar el Tanque estacionario ${propaneTruck.serial}?`)
          .subscribe(result => {
            if (result) {
              this.stationaryTankService.delete(propaneTruck.id).subscribe(
                (response) => {
                  if (response.statusCode === 200) {
                    this.toastr.success(`Tanque estacionario ${propaneTruck.serial} eliminado exitosamente`, 'Éxito');
                    this.fetchStationaryTanks();
                  } else {
                    this.toastr.error('Error al eliminar Tanque estacionario', response.message);
                  }
                },
                (error) => {
                  this.toastr.error('Error al eliminar Tanque estacionario', 'Error');
                }
              );
            }
          });
      }
    });
  }

  setPageSizeToTotal() {
    this.pageSize = this.stationaryTanks.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.stationaryTanks.sort((a: any, b: any) => {
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


  toCreateStationaryTank() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateStationaryTankComponent, {
          width: '750px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchStationaryTanks();
        });
      }
    });
  }

  toEditStationaryTank(stationaryTank: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditStationaryTankComponent, {
          width: '750px',
          data: { stationaryTankId: stationaryTank.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchStationaryTanks();
        });
      }
    });
  }

  toImportStationaryTanks() {
    this.router.navigate(['/poseidon/stationary-tank/import']);
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }

}
