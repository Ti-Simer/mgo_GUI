import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { TabletService } from 'src/app/services/poseidon-services/tablet.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogCreateTabletsComponent } from '../dialog-create-tablets/dialog-create-tablets.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditTabletsComponent } from '../dialog-edit-tablets/dialog-edit-tablets.component';

@Component({
  selector: 'app-tablets-list',
  templateUrl: './tablets-list.component.html',
  styleUrls: ['./tablets-list.component.scss']
})
export class TabletsListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda

  tablets: any[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private tabletService: TabletService,
    private toastr: ToastrService,
    private router: Router,
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
    this.fetchTablets();
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
      const inputElement = this.searchInput.nativeElement! as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#myTable tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  fetchTablets() {
    this.isLoading = true;
    this.tabletService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.tablets = response.data;
        } else {
          this.toastr.info('No se han encontrado Tabletas')
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar las Tabletas ${error}`);
      }
    );
  }

  deleteTablet(tablet: any) {
    this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar la Tablet ${tablet.mac}?`)
      .subscribe(result => {
        if (result) {
          this.tabletService.delete(tablet.id).subscribe(
            (response) => {
              if (response.statusCode === 200) {
                this.toastr.success(`Tablet ${tablet.mac} eliminado exitosamente`, 'Éxito');
                this.fetchTablets();
              } else {
                this.toastr.error('Error al eliminar Tablet', response.message);
              }
            },
            (error) => {
              this.toastr.error('Error al eliminar Tablet', 'Error');
            }
          );
        }
      });
  }

  setPageSizeToTotal() {
    this.pageSize = this.tablets.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.tablets.sort((a: any, b: any) => {
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

  toCreateTablets() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateTabletsComponent, {
          width: '750px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchTablets();
        });
      }
    });
  }

  toEditTablet(tablet: any) {
    if (tablet.status === 'EN CURSO') {
      this.toastr.warning('No se puede editar un Auto Tanque en curso', 'Advertencia');
    } else {
      this.authService.editChecker().subscribe(flag => {
        if (!flag) {
          this.toastr.warning('No tienes permisos para editar');
        } else {
          const dialogRef = this.dialog.open(DialogEditTabletsComponent, {
            width: '750px',
            data: { tabletId: tablet.id }
          });
  
          dialogRef.afterClosed().subscribe(result => {
            this.fetchTablets();
          });
        }
      });
    }
  }

  toViewTablet(id: any) {
    this.router.navigate(['/poseidon/tablets/view/', this.authService.encryptData(id)]);
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }

}
