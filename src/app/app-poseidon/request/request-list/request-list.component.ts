import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/poseidon-services/request.service';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [50, 100, 200]; // Opciones de tamaño de página
  pageSize: number = 50; // Tamaño de página predeterminado
  pageIndex: number = 1; // Página actual
  totalRequests: number = 0;

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda

  searchForm!: FormGroup;
  request: any[] = [];
  csvData: any[] = [];

  isLoading = false;

  constructor(
    private authService: AuthService,
    private requestService: RequestService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialogService: DialogService,
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toOrders();
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });

    this.searchForm = new FormBuilder().group({
      propane_truck: [null, Validators.required],
      date: [null, Validators.required],
      date2: [null],
    });
  }

  ngOnInit(): void {
    this.fetchRequests();
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
    this.fetchRequests();
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

  fetchRequests() {
    this.isLoading = true;
    const pageData = {
      pageData: {
        page: this.pageIndex,
        limit: this.pageSize
      }
    };

    this.requestService.getAll(pageData).subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          this.pageIndex = response.data.page;
          this.pageSize = response.data.limit;
          this.totalRequests = response.data.total; // Total de elementos para la paginación
          this.request = response.data.requests.sort((a: any, b: any) => {
            let dateA = new Date(a.internal_folio);
            let dateB = new Date(b.internal_folio);
            return dateB.getTime() - dateA.getTime();
          });
        } else {
          this.toastr.info('No se han encontrado servicios');
        }
      },
      error => {
        this.isLoading = false;
        this.toastr.error('Ha ocurrido un error al consultar los servicios: ', error);
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.totalRequests;
    this.fetchRequests();
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.request.sort((a: any, b: any) => {
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

  makeQuerySearch() {
    const propane_truck = this.searchForm.get('propane_truck')?.value;
    const date = this.searchForm.get('date')?.value;
    const date2 = this.searchForm.get('date2')?.value;

    const searchQuery = {
      propane_truck: propane_truck,
      date: date,
      date2: date2
    };

    this.isLoading = true;

    this.requestService.getByQuery(searchQuery).subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          this.totalRequests = response.data.length;
          this.request = response.data.sort((a: any, b: any) => {
            let dateA = new Date(a.internal_folio);
            let dateB = new Date(b.internal_folio);
            return dateB.getTime() - dateA.getTime();
          });
          this.toastr.success(response.message, 'Éxito');
        } else {
          this.toastr.info('No se han encontrado servicios');
        }
      },
      error => {
        this.isLoading = false;
        this.toastr.error('Ha ocurrido un error al consultar los servicios: ', error);
      }
    );
  }

  infoFilter() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {

      case 'es':
        title = 'Rango de fechas';

        message = `
          <strong>=== INFORMACIÓN ===</strong><br><br>
          El rango de fechas puede utilizarce para filtrar los servicios por fecha de creación, el campo de fecha rango 2 es opcional, si se deja vacío se tomará como la misma fecha que el campo de rango 1.<br>
        `;
        break;

      case 'en':
        title = 'Date Range';

        message = `
          <strong>=== INFORMATION ===</strong><br><br>
          The date range can be used to filter services by creation date, the date range 2 field is optional, if left empty it will be taken as the same date as the range 1 field.<br>
        `;
        break;

      case 'pt':
        title = 'Intervalo de Datas';
        message = `
          <strong>=== INFORMAÇÃO ===</strong><br><br>
          O intervalo de datas pode ser usado para filtrar serviços por data de criação, o campo de intervalo de datas 2 é opcional, se deixado em branco, será considerado a mesma data que o campo de intervalo 1.<br>
        `;
        break;

      default:
        break;
    }

    this.dialogService.openInfoDialog(message, title);
  }

  getEndIndex(): number {
    return Math.min((this.pageIndex * this.pageSize) + this.pageSize, this.totalRequests);
  }

  exportToExcelPaginator() {
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    const exportData = this.csvData.slice(start, end);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `request.xlsx`);
  }

  toOrders() {
    this.router.navigate(['/poseidon/orders/list']);
  }

  toCreateOrder() {
    this.router.navigate(['/poseidon/orders/create']);
  }

  toViewRequest(id: any) {
    this.router.navigate(['/poseidon/request/view', this.authService.encryptData(id)]);
  }


}
