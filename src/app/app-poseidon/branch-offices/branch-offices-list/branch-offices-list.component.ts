import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogCreateBranchOfficeComponent } from '../dialog-create-branch-office/dialog-create-branch-office.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditBranchOfficeComponent } from '../dialog-edit-branch-office/dialog-edit-branch-office.component';

@Component({
  selector: 'app-branch-offices-list',
  templateUrl: './branch-offices-list.component.html',
  styleUrls: ['./branch-offices-list.component.scss']
})
export class BranchOfficesListComponent {
  private languageSubscription!: Subscription;
  searchForm!: FormGroup;

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

  public Math = Math;
  collapsed = true;
  private menuSub!: Subscription;

  constructor(
    private branchOfficesService: BranchOfficesService,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        toastr.warning('No tienes permisos para leer esta información');
      }
    });

    this.searchForm = this.formBuilder.group({
      branch_office: [null],
      city: [null],
      nit: [null]
    });
  }

  ngOnInit(): void {
    this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
      this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
    });

    this.fetchBranchOffices();

    this.languageSubscription = this.languageService.getLanguageObservable().subscribe(newLanguage => {
      this.translate.use(newLanguage);
      this.translate.setDefaultLang(newLanguage);
    });
  }

  ngOnDestroy(): void {
    this.menuSub?.unsubscribe();

    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalBranchOffices / this.pageSize)); // ✅ Usando totalBranchOffices
  }

  onPageSizeChange() {
    this.pageIndex = 0;
    this.fetchBranchOffices();
  }

  goToPage(page: number) {
    if (page < 0) page = 0;
    if (page > this.totalPages - 1) page = this.totalPages - 1;
    this.pageIndex = page;
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

  makeQuerySearch() {
    const branch_office = this.searchForm.get('branch_office')?.value;
    const city = this.searchForm.get('city')?.value;
    const nit = this.searchForm.get('nit')?.value;

    const searchQuery = {
      branch_office: branch_office,
      city: city,
      nit: nit
    };

    this.isLoading = true;

    this.branchOfficesService.getByQuery(searchQuery).subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          this.totalBranchOffices = response.data.length;
          this.branchOffices = response.data.sort((a: any, b: any) => {
            let dateA = new Date(a.internal_folio);
            let dateB = new Date(b.internal_folio);
            return dateB.getTime() - dateA.getTime();
          });
          this.toastr.success(response.message, 'Éxito');
        } else {
          this.toastr.info('No se han encontrado Establecimientos');
        }
      },
      error => {
        this.isLoading = false;
        this.toastr.error('Ha ocurrido un error al consultar los Establecimientos: ', error);
      }
    );
  }

  infoFilter() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {

      case 'es':
        title = 'Buscar por ciudad';

        message = `
          <strong>=== INFORMACIÓN ===</strong><br><br>
          El campo ciudad es opcional, si se llena el formulario de búsqueda con el campo ciudad la consulta se ejecuta primero por nombre de establecimiento y despues por ciudad.<br>
        `;
        break;

      case 'en':
        title = 'Search by city';

        message = `
          <strong>=== INFORMATION ===</strong><br><br>
          The city field is optional. If the search form is filled out with the city field, the query is executed first by establishment name and then by city.<br>
        `;
        break;

      case 'pt':
        title = 'Intervalo de Datas';
        message = `
          <strong>=== INFORMAÇÃO ===</strong><br><br>
          O campo cidade é opcional, caso o formulário de busca seja preenchido com o campo cidade a consulta é realizada primeiro por nome do estabelecimento e depois por cidade.<br>
        `;
        break;

      default:
        break;
    }

    this.dialogService.openInfoDialog(message, title);
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

  toClients() {
    this.router.navigate(['/poseidon/client/list']);
  }

  toHome() {
    this.router.navigate(['/poseidon/home']);
  }
}
