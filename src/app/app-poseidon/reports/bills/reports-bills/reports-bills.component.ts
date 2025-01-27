import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/services/auth.service'
import { BillService } from 'src/app/services/poseidon-services/bill.service'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { DatePipe } from '@angular/common'
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogViewBillComponent } from '../dialog-view-bill/dialog-view-bill.component'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-reports-bills',
  templateUrl: './reports-bills.component.html',
  styleUrls: ['./reports-bills.component.scss'],
  providers: [DatePipe]
})
export class ReportsBillsComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator
  pageSizeOptions: number[] = [25, 50, 100] // Opciones de tamaño de página
  pageSize: number = 25 // Tamaño de página predeterminado
  pageIndex: number = 0 // Página actual

  @ViewChild('myInput') searchInput!: ElementRef // Obtiene una referencia al elemento de entrada de búsqueda
  branchOfficeCode: any
  bills: any[] = []

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private billService: BillService,
    private toastr: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.route.params.subscribe(params => {
      this.branchOfficeCode = authService.decryptData(params['id'])
    });
  }

  ngOnInit(): void {
    this.authService.rolChecker()
    this.fetchBillsByBranchOfficeId()
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      })
    }
  }

  // Método para manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.onPageChange(event)
      })

      this.initializeSearchFilter()
    }
  }

  setPageSizeToTotal() {
    this.pageSize = this.bills.length;
  }

  initializeSearchFilter() {
    if (this.searchInput) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement
      const value = inputElement.value.toLowerCase()
      const tableRows = document.querySelectorAll('#myTable tr')

      tableRows.forEach(row => {
        const rowText = row.textContent!.toLowerCase()
          ; (row as HTMLElement).style.display = rowText.includes(value)
            ? 'table-row'
            : 'none'
      })
    }
  }

  fetchBillsByBranchOfficeId() {
    this.billService.getByBranchOfficeCode(this.branchOfficeCode).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.bills = response.data.sort((a: any, b: any) => {
            let dateA = new Date(a.fecha); // o a.update dependiendo de qué fecha quieres usar
            let dateB = new Date(b.fecha); // o b.update dependiendo de qué fecha quieres usar
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });
        } else {
          this.toastr.info('No se han encontrado facturas en este establecimiento')
          this.toReports()
        }
      },
      error => {
        this.toastr.error(
          `Ha ocurrido un error al obtener las facturas: ${error}`
        )
      }
    )
  }

  tranformDate(fecha: string): string {
    const partesFecha = fecha.split('/')
    const anioCompleto = `20${partesFecha[2]}` // Suponiendo que son años del 2000 al 2099

    const fechaCompleta = new Date(
      `${anioCompleto}-${partesFecha[1]}-${partesFecha[0]}`
    )
    return this.datePipe
      .transform(fechaCompleta, 'dd - MMMM - yyyy')!
      .toLowerCase()
  }

  toReports() {
    this.router.navigate(['/poseidon/reports/list'])
  }

  toBill(bill: any) {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        const dialogRef = this.dialog.open(DialogViewBillComponent, {
          width: '750px',
          data: { billId: bill.id }
        });
      }
    });
  }

  toGraphs(id: any) {
    this.router.navigate(['/poseidon/reports/graphs', this.authService.encryptData(id)]);
  }
}
