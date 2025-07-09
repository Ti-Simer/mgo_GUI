import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ClientService } from 'src/app/services/poseidon-services/client.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogCreateClientsComponent } from '../dialog-create-clients/dialog-create-clients.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditClientsComponent } from '../dialog-edit-clients/dialog-edit-clients.component';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent {
  private languageSubscription!: Subscription;
  searchForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  clients: any[] = [];
  isLoading = false;

  public Math = Math;
  collapsed = true;
  private menuSub!: Subscription;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
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

    this.searchForm = new FormBuilder().group({
      firstName: [null, Validators.required],
      lastName: [null],
      cc: [null],
    });
  }

  ngOnInit(): void {
    this.fetchClients();

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
    return Math.max(1, Math.ceil(this.clients.length / this.pageSize));
  }

  onPageSizeChange() {
    this.pageIndex = 0;
  }

  goToPage(page: number) {
    if (page < 0) page = 0;
    if (page > this.totalPages - 1) page = this.totalPages - 1;
    this.pageIndex = page;
  }

  fetchClients() {
    this.isLoading = true;
    this.clientService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.clients = response.data;
        } else {
          this.toastr.info('No se han encontrado clientes');
        }
      }, (error) => {
        this.toastr.error('Ha ocurrido un error al consultar los clientes: ', error);
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.clients.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.clients.sort((a: any, b: any) => {
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

  deleteClient(client: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar el cliente ${client.firstName} ${client.lastName} ?`)
          .subscribe(result => {
            if (result) {
              this.clientService.delete(client.id).subscribe(
                (response) => {
                  if (response.statusCode === 200) {
                    this.toastr.success(`cliente ${client.firstName} ${client.lastName} eliminado exitosamente`, 'Éxito');
                    this.fetchClients();
                  } else {
                    this.toastr.error('Error al eliminar el cliente', response.message);
                  }
                },
                (error) => {
                  this.toastr.error('Error al eliminar el cliente: ', error);
                }
              );
            }
          });
      }
    });
  }

  makeQuerySearch() {
    const firstName = this.searchForm.get('firstName')?.value;
    const lastName = this.searchForm.get('lastName')?.value;
    const cc = this.searchForm.get('cc')?.value;

    const searchQuery = {
      firstName: firstName,
      lastName: lastName,
      cc: cc
    };

    this.isLoading = true;

    this.clientService.getByQuery(searchQuery).subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          //this.total = response.data.length;
          this.clients = response.data.sort((a: any, b: any) => {
            let dateA = new Date(a.internal_folio);
            let dateB = new Date(b.internal_folio);
            return dateB.getTime() - dateA.getTime();
          });
          this.toastr.success(response.message, 'Éxito');
        } else {
          this.toastr.info(response.message, 'Información');
        }
      },
      error => {
        this.isLoading = false;
        this.toastr.error('Ha ocurrido un error al consultar los pedidos: ', error);
      }
    );
  }

  infoFilter() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {

      case 'es':
        title = 'Campos de Búsqueda';

        message = `
          <strong>=== INFORMACIÓN ===</strong><br><br>
          Los campos nombre, apellido, identificación pueden funcionar unitariamente.<br>
        `;
        break;

      case 'en':
        title = 'Search Fields';

        message = `
          <strong>=== INFORMATION ===</strong><br><br>
          The fields name, last name, identification can work individually.<br>
        `;
        break;

      case 'pt':
        title = 'Campos de Pesquisa';
        message = `
          <strong>=== INFORMAÇÃO ===</strong><br><br>
          Os campos nome, sobrenome, identificação podem funcionar individualmente.<br>
        `;
        break;

      default:
        break;
    }

    this.dialogService.openInfoDialog(message, title);
  }

  toCreateClient() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateClientsComponent, {
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchClients();
        });
      }
    });
  }

  toEditClient(client: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditClientsComponent, {
          width: '600px',
          data: { clientId: client.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchClients();
        });
      }
    });
  }

  toOccupations() {
    this.router.navigate(['/poseidon/occupation/list']);
  }

  toImportClients() {
    this.router.navigate(['/poseidon/client/import']);
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }

}
