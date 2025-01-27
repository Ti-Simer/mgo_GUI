import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports-branch-offices',
  templateUrl: './reports-branch-offices.component.html',
  styleUrls: ['./reports-branch-offices.component.scss']
})
export class ReportsBranchOfficesComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual


  branchOffices: any[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private branchOfficesService: BranchOfficesService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
  }

  ngOnInit(): void {
    this.authService.readChecker();
    this.fetchBranchOffices();
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
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

  fetchBranchOffices() {
    this.isLoading = true;
    this.branchOfficesService.getBranchOfficesWithBills().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.branchOffices = response.data
        } else {
          this.toastr.info(`No se han encontrado establecimientos con historial de facturación.`, 'Información');
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar las sucursales: ${error}`);
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.branchOffices.length;
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

  toViewReport(id: any) {
    console.log(id);
    
    this.router.navigate(['/poseidon/reports/bills/', this.authService.encryptData(id)]);
  }

  toGraphs(id: any) {
    console.log(id);
    
    this.router.navigate(['/poseidon/reports/graphs', this.authService.encryptData(id)]);
  }

}
