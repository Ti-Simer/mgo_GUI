import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { OccupationService } from 'src/app/services/poseidon-services/occupation.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogCreateOcupationsComponent } from '../dialog-create-ocupations/dialog-create-ocupations.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditOccupationsComponent } from '../dialog-edit-occupations/dialog-edit-occupations.component';

@Component({
  selector: 'app-occupations-list',
  templateUrl: './occupations-list.component.html',
  styleUrls: ['./occupations-list.component.scss']
})
export class OccupationsListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  occupations: any[] = [];
  isLoading = false;

  public Math = Math;
  collapsed = true;
  private menuSub!: Subscription;

  constructor(
    private authService: AuthService,
    private occupationService: OccupationService,
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
    this.fetchOccupations();

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
    return Math.max(1, Math.ceil(this.occupations.length / this.pageSize));
  }

  onPageSizeChange() {
    this.pageIndex = 0;
  }

  goToPage(page: number) {
    if (page < 0) page = 0;
    if (page > this.totalPages - 1) page = this.totalPages - 1;
    this.pageIndex = page;
  }

  fetchOccupations() {
    this.isLoading = true;
    this.occupationService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.occupations = response.data;
        } else {
          this.toastr.info('No se han encontrado cargos');
        }
      }, (error) => {
        this.toastr.error('Ha ocurrido un error al consultar las cargos: ', error);
      }
    );
  }

  deleteOccupation(occupation: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar la cargo ${occupation.name} ?`)
          .subscribe(result => {
            if (result) {
              this.occupationService.delete(occupation.id).subscribe(
                (response) => {
                  if (response.statusCode === 200) {
                    this.fetchOccupations();
                    this.toastr.success(`cargo ${occupation.name} eliminada exitosamente`, 'Éxito');
                  } else {
                    this.toastr.error('Error al eliminar la cargo', response.message);
                  }
                },
                (error) => {
                  this.toastr.error('Error al eliminar la cargo: ', error);
                }
              );
            }
          });
      }
    });
  }

  setPageSizeToTotal() {
    this.pageSize = this.occupations.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.occupations.sort((a: any, b: any) => {
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

  toCreateOccupation() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateOcupationsComponent, {
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchOccupations();
        });
      }
    });
  }

  toEditOccupation(occupation: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditOccupationsComponent, {
          width: '750px',
          data: { occupationId: occupation.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchOccupations();
        });
      }
    });
  }

  toClients() {
    this.router.navigate(['/poseidon/client/list']);
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }

}
