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
import { RequestStore } from './request.store';
import { Observable } from 'rxjs';
import { DialogViewRequestComponent } from '../dialog-view-request/dialog-view-request.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent {
  private languageSubscription!: Subscription;
  private menuSub!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [50, 100, 200]; // Opciones de tamaño de página
  pageSize: number = 50; // Tamaño de página predeterminado
  pageIndex: number = 1; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda

  // Observables del store
  currentDir: string = 'asc'; // Default sorting direction
  request$: Observable<any[]> = this.store.request$;
  total$: Observable<number> = this.store.total$;
  page$: Observable<number> = this.store.page$;
  pageSize$: Observable<number> = this.store.pageSize$;
  loading$: Observable<boolean> = this.store.loading$;

  collapsed = true;
  csvData: any[] = [];
  searchForm!: FormGroup;

  isLoading = false;

  constructor(
    private authService: AuthService,
    private requestService: RequestService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialogService: DialogService,
    private store: RequestStore,
    private dialog: MatDialog
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
      propane_truck: [null],
      date: [null],
      date2: [null],
    });
  }

  ngOnInit(): void {
    this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
      this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
    });

    this.store.loadRequest();        // carga inicial
  }

  onPageChange(event: any) {
    this.store.setPage(event.pageIndex + 1);
    this.store.setPageSize(event.pageSize);
    this.store.loadRequest();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.onPageChange(event);
      });
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

  fetchRequests() {
    // Reset filtros y recargar todo
    this.searchForm.reset();
    this.store.setFilters({ from: null, to: null, propane_truck: null });
    this.store.loadRequest();
  }

  onSortChange(by: string) {
    const dir = this.currentDir === 'asc' ? 'desc' : 'asc';
    this.store.setSort({ by, dir });
  }

  makeQuerySearch() {
    const { date, date2, propane_truck } = this.searchForm.value;

    if (propane_truck && !date) {
      this.toastr.warning('Debes seleccionar una fecha para filtrar por camión de propano');
      return;
    }

    this.store.setFilters({
      from: date,
      to: date2 || date,
      propane_truck
    });
    this.store.loadRequest();
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

  toReports() {
    this.router.navigate(['/poseidon/reports/list']);
  }

  toCreateOrder() {
    this.router.navigate(['/poseidon/orders/create']);
  }

  toViewRequest(request: any) {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogViewRequestComponent, {
          width: '750px',
          data: { requestId: request.id }
        });
      }
    });
  }


}
