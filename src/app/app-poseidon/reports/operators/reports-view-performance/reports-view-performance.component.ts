import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BillService } from 'src/app/services/poseidon-services/bill.service';
import { ChartOptions } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatPaginator } from '@angular/material/paginator';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports-view-performance',
  templateUrl: './reports-view-performance.component.html',
  styleUrls: ['./reports-view-performance.component.scss']
})
export class ReportsViewPerformanceComponent {
  private languageSubscription!: Subscription;
  currencyCode: string = 'COP';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  bills: any;
  operatorId: any;
  operator: any;

  ///Parámetros de gráfica
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = ['Error', 'Satisfactorias', 'Pendientes'];
  public pieChartDatasets = [{
    data: [0, 0, 0]
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(
    private authService: AuthService,
    private billService: BillService,
    private UsuarioService: UsuarioService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.route.params.subscribe(
      params => { this.operatorId = params['id'] }
    );
  }

  ngOnInit(): void {
    
    this.fetchBills();
    this.getOperator();

    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }

    this.currencyCode = this.languageService.detectRegionAndSetCurrency();
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
    }
  }

  getOperator() {
    this.UsuarioService.getUserById(this.operatorId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.operator = response.data;
        } else {
          this.toastr.error('Ha ocurrido un problema al consultar el operador');
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar el operador: ${error}`);
      }
    );
  }

  fetchBills() {
    this.billService.getByOperatorId(this.operatorId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.bills = response.data;

          var pendientes = 0;
          var satisfactorias = 0;
          var errores = 0;

          for (let i = 0; i < this.bills.length; i++) {
            if (this.bills[i].state == 'PENDIENTE') {
              pendientes = pendientes + 1;
            }

            if (this.bills[i].state == 'EXITO') {
              satisfactorias = satisfactorias + 1;
            }

            if (this.bills[i].state == 'ERROR') {
              errores = errores + 1;
            }
          }

          this.pieChartDatasets[0].data[0] = errores;
          this.pieChartDatasets[0].data[1] = satisfactorias;
          this.pieChartDatasets[0].data[2] = pendientes;


        } else {
          this.toastr.info('No se han creado facturas realizadas por el operador');
          this.toReports();
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar las facturas ${error}`);
      }
    );
  }

  printGraph() {
    this.toastr.warning('Por favor espere hasta que se descargue el archivo, cada vez que presione el botón se generará un archivo!!');

    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('l', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 6
    };
    html2canvas(DATA!, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 0;
      const bufferY = 60;
      const imgProps = (doc as any).getImageProperties(img);

      //const pdfWidth = imgProps.width;
      //const pdfHeight = imgProps.height;
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Aumenta el tamaño de la imagen en el papel
      const imageX = bufferX; // Posición X de la imagen
      const imageY = bufferY; // Posición Y de la imagen
      const imageWidth = pdfWidth; // Ancho de la imagen
      const imageHeight = pdfHeight; // Alto de la imagen

      doc.addImage(img, 'PNG', imageX, imageY, imageWidth, imageHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`piegraph-${this.operator.id}.pdf`);
    });
  }

  toReports() {
    this.router.navigate(['/poseidon/reports/list']);
  }

}