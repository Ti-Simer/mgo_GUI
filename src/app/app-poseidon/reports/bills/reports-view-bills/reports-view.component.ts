import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BillService } from 'src/app/services/poseidon-services/bill.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports-view',
  templateUrl: './reports-view.component.html',
  styleUrls: ['./reports-view.component.scss']
})
export class ReportsViewComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  branchOfficeId: any;
  bills: any[] = [];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private billService: BillService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.route.params.subscribe(params => {
      this.branchOfficeId = params['id']
    });
  }

  ngOnInit(): void {

    this.fetchBillsByBranchOfficeId();
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
    const inputElement = this.searchInput.nativeElement as HTMLInputElement;
    const value = inputElement.value.toLowerCase();
    const tableRows = document.querySelectorAll('#myTable tr');

    tableRows.forEach((row) => {
      const rowText = row.textContent!.toLowerCase();
      (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
    });
  }

  fetchBillsByBranchOfficeId() {
    this.billService.getByBranchOfficeCode(this.branchOfficeId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.bills = response.data;

        } else {
          this.toastr.info('No se han encontrado facturas en esta sucursal');
          this.toReports();
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al obtener las facturas: ${error}`);
      }
    );
  }

  toReports() {
    this.router.navigate(['/poseidon/reports/list']);
  }

  toBill(id: any) {
    this.router.navigate(['/poseidon/reports/bill', id]);
  }

}

