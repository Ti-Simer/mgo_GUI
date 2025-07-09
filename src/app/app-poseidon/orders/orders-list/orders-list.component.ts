import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdersService } from 'src/app/services/poseidon-services/orders.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogViewOrdersComponent } from '../dialog-view-orders/dialog-view-orders.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateOrdersComponent } from '../dialog-create-orders/dialog-create-orders.component';
import { OrdersStore } from './orders.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent {
  currentDir: string = 'asc'; // Default sorting direction
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [50, 100, 200]; // Opciones de tamaño de página
  pageSize: number = 50; // Tamaño de página predeterminado
  pageIndex: number = 1; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda

  private languageSubscription!: Subscription;

  collapsed = true;
  private menuSub!: Subscription;

  // Observables del store
  orders$: Observable<any[]> = this.store.orders$;
  total$: Observable<number> = this.store.total$;
  page$: Observable<number> = this.store.page$;
  pageSize$: Observable<number> = this.store.pageSize$;
  loading$: Observable<boolean> = this.store.loading$;

  isLoading = false;

  searchForm: FormGroup;

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    private store: OrdersStore,
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        toastr.warning('No tienes permisos para leer esta información');
      }
    });

    this.searchForm = new FormBuilder().group({
      date: [null, Validators.required],
      date2: [null],
    });
  }

  ngOnInit(): void {
    this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
      this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
    });

    this.store.loadOrders();        // carga inicial
  }

  onPageChange(event: any) {
    this.store.setPage(event.pageIndex + 1);
    this.store.setPageSize(event.pageSize);
    this.store.loadOrders();
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

  fetchOrders() {
    // Reset filtros y recargar todo
    this.searchForm.reset();
    this.store.setSearchDates({ from: null, to: null });
    this.store.loadOrders();
  }

  makeQuerySearch() {
    const dateFrom = this.searchForm.value.date;
    const dateTo = this.searchForm.value.date2 || dateFrom;
    this.store.setSearchDates({ from: dateFrom, to: dateTo });
    this.store.loadOrders();
  }

  toEditOrder(order: any) { }

  deleteOrder(id: string) {
    this.dialogService.openConfirmDialog('¿Esta seguro que desea eliminar el Pedido?, recuerde que esta información sera borrada definitivamente')
      .subscribe(result => {
        if (result) {
          this.ordersService.delete(id).subscribe(
            response => {
              console.log(response);

              if (response.statusCode === 200) {
                this.toastr.info('Pedido eliminado exitosamente', 'Información');
                this.fetchOrders();
              } else {
                this.toastr.warning('Ocurrió un error al eliminar el Pedido', response.message);
              }
            },
            error => {
              this.toastr.error('Ha ocurrido un error al eliminar el Pedido', error);
            }
          );
        }
      });
  }

  onSortChange(by: string) {
    const dir = this.currentDir === 'asc' ? 'desc' : 'asc';
    this.store.setSort({ by, dir });
  }

  toViewOrder(order: any) {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        const dialogRef = this.dialog.open(DialogViewOrdersComponent, {
          width: '460px',
          data: { orderId: order.id }
        });
      }
    });
  }

  toCreateOrder() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateOrdersComponent, {
          width: '900px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchOrders();
        });
      }
    });
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

  toCourses() {
    this.router.navigate(['/poseidon/courses/admin'])
  }

  toBranchOffices() {
    this.router.navigate(['/poseidon/branch-offices/list']);
  }

  toRequest() {
    this.router.navigate(['/poseidon/request/list']);
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }
}
