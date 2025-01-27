import { Component, ViewChild, ElementRef } from '@angular/core';
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

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [50, 100, 200]; // Opciones de tamaño de página
  pageSize: number = 50; // Tamaño de página predeterminado
  pageIndex: number = 1; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda

  orders: any[] = [];
  totalOrders: number = 0;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService,
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
    this.fetchOrders();
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
    this.fetchOrders();
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
    this.isLoading = true;
    const pageData = {
      pageData: {
        page: this.pageIndex,
        limit: this.pageSize
      }
    };

    this.ordersService.getAll(pageData).subscribe(
      response => {        
        this.isLoading = false;
        if (response.statusCode == 200) {          
          this.pageIndex = response.data.page;
          this.pageSize = response.data.limit;
          this.totalOrders = response.data.total; // Total de elementos para la paginación
          this.orders = response.data.orders.sort((a: any, b: any) => {
            let dateA = new Date(a.folio); // o a.update dependiendo de qué fecha quieres usar
            let dateB = new Date(b.folio); // o b.update dependiendo de qué fecha quieres usar
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });

        } else {
          this.toastr.info('No se han encontrado pedidos');
        }
      }, (error) => {
        this.toastr.error('Ha ocurrido un error al consultar los pedidos: ', error);
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.totalOrders;
    this.fetchOrders();
  }

  getEndIndex(): number {
    return Math.min((this.pageIndex * this.pageSize) + this.pageSize, this.totalOrders);
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

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.orders.sort((a: any, b: any) => {
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
