import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogCreateBranchOfficeComponent } from '../../dialog-create-branch-office/dialog-create-branch-office.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditBranchOfficeComponent } from '../../dialog-edit-branch-office/dialog-edit-branch-office.component';

@Component({
  selector: 'app-branch-offices-actived',
  templateUrl: './branch-offices-actived.component.html',
  styleUrls: ['./branch-offices-actived.component.scss']
})
export class BranchOfficesActivedComponent {
  private languageSubscription!: Subscription;

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [50, 100, 200]; // Opciones de tamaño de página
  pageSize: number = 50; // Tamaño de página predeterminado
  pageIndex: number = 1; // Página actual

  listUrl: string = '../../../../assets/images/icons/list.svg';
  cardUrl: string = '../../../../assets/images/icons/card.svg';

  branchOffices: any[] = [];
  totalBranchOffices: number = 0;

  isLoading = false;
  isList: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private branchOfficesService: BranchOfficesService,
    private dialogService: DialogService,
    private toastr: ToastrService,
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
    this.fetchBranchOffices();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.onPageChange(event);
      });
    }
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex + 1; // Angular Material paginator is zero-based
    this.pageSize = event.pageSize;
    this.fetchBranchOffices();
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

  fetchBranchOffices(): void {
    this.isLoading = true;
    const pageData = {
      pageData: {
        page: this.pageIndex,
        limit: this.pageSize
      }
    };

    this.branchOfficesService.getAll(pageData).subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          this.pageIndex = response.data.page;
          this.pageSize = response.data.limit;
          this.totalBranchOffices = response.data.total; // Total de elementos para la paginación
          this.branchOffices = response.data.branchOffices;
        } else {
          this.toastr.info('No hay sucursales creadas')
        }
      },
      error => {
        console.error('Error al obtener sucursales:', error);
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.totalBranchOffices;
    this.fetchBranchOffices();
  }

  listOn() {
    this.isList = true;
  }

  listOff() {
    this.isList = false;
  }


  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.branchOffices.sort((a: any, b: any) => {
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

  deleteBranchOffice(branchOffice: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar el rol de ${branchOffice.name} ?`)
          .subscribe(result => {
            if (result) {
              this.branchOfficesService.delete(branchOffice.id).subscribe(
                (response) => {
                  if (response.statusCode === 200) {
                    this.toastr.success('Sucursal eliminada exitosamente', 'Éxito');
                    this.fetchBranchOffices();
                  } else {
                    this.toastr.error('Error al eliminar Sucursal', response.message);
                  }
                },
                (error) => {
                  this.toastr.error('Error al eliminar Sucursal', 'Error');
                }
              );
            }
          });
      }
    });
  }

  toHome() {
    this.router.navigate(['/poseidon/home']);
  }

  toEditBranchOffice(branchOffice: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditBranchOfficeComponent, {
          width: '1000px',
          data: { branchOfficeId: branchOffice.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchBranchOffices();
        });
      }
    });
  }

  toCreateBranchOffices() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateBranchOfficeComponent, {
          width: '1000px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchBranchOffices();
        });
      }
    });
  }

  toImportBranchOffices() {
    this.router.navigate(['/poseidon/branch-offices/import']);
  }

  toOrders() {
    this.router.navigate(['/poseidon/orders/list']);
  }

}
