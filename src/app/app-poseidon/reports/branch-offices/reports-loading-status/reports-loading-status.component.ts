import { Component, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/services/auth.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas'
import { BillService } from 'src/app/services/poseidon-services/bill.service'
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports-loading-status',
  templateUrl: './reports-loading-status.component.html',
  styleUrls: ['./reports-loading-status.component.scss']
})
export class ReportsLoadingStatusComponent {
  private languageSubscription!: Subscription;

  @ViewChild('chart') private chartRef!: ElementRef;
  chartForm: FormGroup;
  loadingGifUrl: string = 'assets/images/gifs/loading.gif'

  branchOfficeCode: any
  chart: any;
  bills: any;
  dates: any[] = [];
  efectivas: any[] = [];
  error: any[] = [];
  pendiente: any[] = [];
  last10Labels: any[] = [];

  labels: any = [
    { name: 25 },
    { name: 50 },
    { name: 100 },
  ]

  text: any = [
    { name: 'Kilos cargados' },
    { name: 'Ventas efectuadas' },
    { name: 'Densidad' },
    { name: 'Temperatura' },
    { name: 'Volúmen' },
  ]

  constructor(
    private authService: AuthService,
    private billService: BillService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.route.params.subscribe(params => {
      this.branchOfficeCode = this.authService.decryptData(params['id']);
    })

    this.chartForm = this.formBuilder.group({
      labels: [25],
      text: ['Ventas efectuadas']
    });
  }

  ngOnInit(): void {
    this.authService.readChecker();
    this.fetchBills();

    // Suscríbete a los cambios del formulario aquí, fuera de fetchBills
    this.chartForm.valueChanges.subscribe(changes => {
      // Si el gráfico ya existe, destrúyelo
      if (this.chart) {
        this.chart.destroy();
      }

      // Recalcula las etiquetas con el nuevo valor del formulario
      this.last10Labels = this.dates.slice(- + this.chartForm.value.labels);

      // Dibuja el gráfico con las nuevas etiquetas
      this.drawChart(this.last10Labels);
    });
  }

  fetchBills() {
    this.billService.getByBranchOfficeCode(this.branchOfficeCode).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.bills = response.data;

          for (let i = 0; i < this.bills.length; i++) {
            if (this.bills[i].status == 'EFECTIVO') {
              this.efectivas.push(this.bills[i].status);
            }
            if (this.bills[i].status == 'ERROR') {
              this.error.push(this.bills[i].status);
            }
            if (this.bills[i].status == 'PENDIENTE') {
              this.pendiente.push(this.bills[i].status);
            }
          }

          if (this.dates) {
            this.last10Labels = this.dates.slice(- + this.chartForm.value.labels); // Obtiene los últimos 10 elementos
            this.drawChart(this.last10Labels);
          }

        } else {
          this.toastr.warning(
            'Ha ocurrido un problema al consultar las facturas'
          )
        }
      },
      error => {
        this.toastr.error(
          `Ha ocurrido un error al consultar las facturas ${error}`
        )
      }
    )
  }

  drawChart(labels: any) {
    setTimeout(() => {
      // Si el gráfico ya existe, destrúyelo antes de crear uno nuevo
      if (this.chart) {
        this.chart.destroy();
      }

      let labelsData: any[] = [];

      switch (this.languageService.getLanguage()) {
        case 'es':
          labelsData = [
            'Error',
            'Efectivas',
            'Pendiente'
          ]
          break;

        case 'en':
          labelsData = [
            'Error',
            'Effective',
            'Pending'
          ]
          break;

        case 'pt':
          labelsData = [
            'Erro',
            'Eficaz',
            'Pendente'
          ]
          break;
      
        default:
          break;
      }

      this.chart = new Chart(this.chartRef.nativeElement, {
        type: 'pie',
        data: {
          labels: labelsData,
          datasets: [{
            label: 'Estado de Cargues de GLP',
            data: [this.error.length, this.efectivas.length, this.pendiente.length],
            backgroundColor: [
              'rgb(200, 42, 42)',
              'rgb(50, 153, 90)',
              'rgb(243, 233, 43)'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          animation: {
            duration: 1000 // general animation time
          },
        }
      });
    }, 0);
  }

  printGraph() {
    this.toastr.warning(
      'Por favor espere hasta que se descargue el archivo, cada vez que presione el botón se generará un archivo!!'
    )

    const DATA = document.getElementById('htmlData')
    const options = {
      background: 'white',
      scale: 7
    }

    html2canvas(DATA!, options).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `piegraph-${this.bills[0].branch_office_code}.png`
      link.href = imgData
      link.click()
    })
  }

  toReports() {
    this.router.navigate(['/poseidon/reports/list'])
  }

  toReportsBranchOffice() {
    this.router.navigate(['/poseidon/reports/bills/', this.authService.encryptData(this.branchOfficeCode)])
  }

}
