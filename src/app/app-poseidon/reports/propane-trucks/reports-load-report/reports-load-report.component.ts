import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Chart } from 'chart.js';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import * as moment from 'moment';
import 'moment-duration-format';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GraphService } from 'src/app/services/poseidon-services/graph.service';
import { ToastrService } from 'ngx-toastr';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexYAxis,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-reports-load-report',
  templateUrl: './reports-load-report.component.html',
  styleUrls: ['./reports-load-report.component.scss']
})
export class ReportsLoadReportComponent {
  private languageSubscription!: Subscription;

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  @ViewChild('chartBar2') private chartRefBar2!: ElementRef;
  @ViewChild('chartBar') private chartRefBar!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [100, 500, 1000, 2500]; // Opciones de tamaño de página
  pageSize: number = 100; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  public chartOptions!: ChartOptions;

  reportXlsMonthForm: FormGroup;
  plate: any;
  chartForm: FormGroup;
  groupedRecords: any;

  records: any[] = [];
  headers: any;
  csvData: any;

  lastData: any[] = [];
  lastLabels: any[] = [];
  labels: any = [
    { name: 500 },
    { name: 1000 },
    { name: 2500 },
  ]
  text: any = [];

  selectedStart: any;
  selectedEnd: any;

  chart: any;
  chartPie: any;
  chartBar: any;
  chartBar2: any;

  dates: any[] = [];
  totals: any[] = [];
  salesOk: any[] = [];
  salesToDo: any[] = [];
  salesError: any[] = [];
  mass: any[] = [];
  density: any[] = [];
  temperature: any[] = [];
  volume: any[] = [];
  last10Labels: any[] = [];
  column: any;

  //////////////////////
  sumaTotal: any;
  sumaPendientes: any;
  sumaError: any;
  masaTotal: any;
  service_time: any;
  avg_service_time: any;
  masaPromedio: any;
  promedioDensidad: any;
  promedioTotal: any;
  operators: any[] = [];
  propane_trucks: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private graphService: GraphService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.reportXlsMonthForm = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      time_start: [''],
      time_end: [''],
    });

    this.chartForm = this.formBuilder.group({
      labels: [500],
      text: [15],
      types: ['line']
    });

    this.chartForm = this.formBuilder.group({
      labels: [500],
      text: [15],
      types: ['line']
    });

    this.authService.readChecker();

    this.route.params.subscribe(params => {
      this.plate = this.authService.decryptData(params['id'])
    });
  }

  ngOnInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }

    // Suscríbete a los cambios del formulario aquí, fuera de fetchBills
    this.chartForm.valueChanges.subscribe(changes => {
      // Si el gráfico ya existe, destrúyelo
      if (this.chart) {
        this.chart.destroy();
      }

      // Recalcula las etiquetas con el nuevo valor del formulario
      this.lastLabels = this.dates.slice(- + this.chartForm.value.labels);

      // Dibuja el gráfico con las nuevas etiquetas
      this.drawChart(this.lastLabels, this.lastData);
    });
  }

  convertToDate(dateString: string): Date {
    let [day, month, year] = dateString.split("/");
    return new Date(`${month}/${day}/${year}`);
  }

  convertTo24Hour(time: string): string {
    return moment(time, ["h:mm A"]).format("HH:mm:ss");
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

  fetchData() {
    let start = new Date(this.reportXlsMonthForm.value.start);
    let formattedStart = start.toISOString().split('T')[0];

    let end = new Date(this.reportXlsMonthForm.value.end);
    let formattedEnd = end.toISOString().split('T')[0];

    let formattedTimeStart = this.convertTo24Hour(this.reportXlsMonthForm.value.time_start);
    let formattedTimeEnd = this.convertTo24Hour(this.reportXlsMonthForm.value.time_end);

    this.reportXlsMonthForm.patchValue({
      start: formattedStart,
      end: formattedEnd,
      time_start: formattedTimeStart,
      time_end: formattedTimeEnd,
    });

    this.graphService.generateCsvByPropaneTruck(this.plate, this.reportXlsMonthForm.value).subscribe(
      response => {
        console.log(response);
        if (response.statusCode == 200) {
          this.headers = response.data.headers;
          this.records = response.data.records.sort((a: any, b: any) => {
            let dateA = this.convertToDate(a.fecha);
            let dateB = this.convertToDate(b.fecha);
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });

          for (let i = 0; i < this.records.length; i++) {
            this.totals.push(this.records[i].total);
            this.mass.push(this.records[i].masaTotal);
            this.density.push(this.records[i].densidad);
            this.temperature.push(this.records[i].temperatura);
            this.volume.push(this.records[i].volumenTotal);
            this.dates.push(this.records[i].fechaInicial);
            if (this.records[i].status == 'EFECTIVO') {
              this.salesOk.push(this.records[i].total);
            }
            if (this.records[i].status == 'PENDIENTE') {
              this.salesToDo.push(this.records[i].total);
            }
            if (this.records[i].status == 'ERROR') {
              this.salesError.push(this.records[i].total);
            }

            // Calcular la suma del total de todas las facturas en estado EFECTIVO
            this.sumaTotal = this.salesOk.reduce(
              (total: any, salesOk: any) => total + salesOk,
              0
            )

            // Calcular la suma del total de todas las facturas en estado PENDIENTE
            this.sumaPendientes = this.salesToDo.reduce(
              (total: any, salesToDo: any) => total + salesToDo,
              0
            )

            // Calcular la suma del total de todas las facturas en estado ERROR
            this.sumaError = this.salesError.reduce(
              (total: any, salesError: any) => total + salesError,
              0
            )

            // Calcular el promedio de la masa
            this.masaPromedio = this.records.reduce(
              (total: any, record: any) =>
                total + parseFloat(record.masaTotal),
              0
            ) / this.records.length

            // Calcular el total de la masa
            this.masaTotal = this.records.reduce(
              (total: any, record: any) =>
                total + parseFloat(record.masaTotal),
              0
            )

            // Calcular el total de la masa
            this.promedioTotal = this.records.reduce(
              (total: any, record: any) =>
                total + parseFloat(record.total),
              0
            ) / this.records.length

            // Calcular el promedio de densidad
            this.promedioDensidad =
              this.records.reduce(
                (total: any, record: any) =>
                  total + parseFloat(record.densidad),
                0
              ) / this.records.length


            // Calcular el tiempo de servicio total
            let totalServiceTime = moment.duration();
            let serviceTimeCount = 0;
            this.records.forEach(record => {
              if (record.service_time) {
                const timeParts = record.service_time.split(':').map(Number);
                const duration = moment.duration({
                  hours: timeParts[0],
                  minutes: timeParts[1],
                  seconds: timeParts[2]
                });
                totalServiceTime = totalServiceTime.add(duration);
                serviceTimeCount++;
              }
            });
            this.service_time = (totalServiceTime as any).format("HH:mm:ss", { trim: false });

            // Calcular el tiempo promedio de servicio
            let avgServiceTime = moment.duration(totalServiceTime.asMilliseconds() / serviceTimeCount);
            this.avg_service_time = (avgServiceTime as any).format("HH:mm:ss", { trim: false });
          }

          if (this.records) {

            let counts: { [key: number]: number } = {};

            // Recalcula las etiquetas con el nuevo valor del formulario
            this.lastLabels = this.dates.slice(- + this.chartForm.value.labels);
            this.lastData = this.mass.slice(- + this.chartForm.value.labels);

            this.operators = [...new Set(this.records.map((record: { operator: string }) => record.operator))];
            this.propane_trucks = [...new Set(this.records.map((record: { plate: string }) => record.plate))];

            this.groupedRecords = this.records.reduce((acc, record) => {
              if (!acc[record.branch_office_name]) {
                acc[record.branch_office_name] = {
                  efectivo: { count: 0, kilos: 0 },
                  pendiente: { count: 0, kilos: 0 },
                  error: { count: 0, kilos: 0 },
                  total_cilindros: 0,
                  total_kilos: 0
                };
              }

              if (record.status === 'EFECTIVO') {
                acc[record.branch_office_name].efectivo.count += 1;
                acc[record.branch_office_name].efectivo.kilos += record.masaTotal;
              } else if (record.status === 'PENDIENTE') {
                acc[record.branch_office_name].pendiente.count += 1;
                acc[record.branch_office_name].pendiente.kilos += record.masaTotal;
              } else if (record.status === 'ERROR') {
                acc[record.branch_office_name].error.count += 1;
                acc[record.branch_office_name].error.kilos += record.masaTotal;
              }

              acc[record.branch_office_name].total_cilindros += 1;
              acc[record.branch_office_name].total_kilos += record.masaTotal;

              return acc;
            }, {});

            this.drawChart(this.lastLabels, this.lastData);
            this.drawChartBar();
            this.drawChartBar2();
          }

          switch (this.languageService.getLanguage()) {
            case 'es':
              this.csvData = this.records.map(record => ({
                "Remisión": record.bill_code,
                "Fecha": record.fecha,
                "Establecimiento": record.branch_office_name,
                "Operador": record.operator,
                "Auto-tanque": record.plate,
                "Densidad": record.densidad,
                "Temperatura": record.temperatura,
                "Masa aplicada": record.masaTotal,
                "Volumen": record.volumenTotal,
                "Total": record.total,
                "Estado": record.status,
              }))
              break;

            case 'en':
              this.csvData = this.records.map(record => ({
                "Bill": record.bill_code,
                "Date": record.fecha,
                "Branch office": record.branch_office_name,
                "Operator": record.operator,
                "Propane truck": record.plate,
                "Density": record.densidad,
                "Temperature": record.temperatura,
                "Applied mass": record.masaTotal,
                "Volume": record.volumenTotal,
                "Total": record.total,
                "Status": record.status,
              }))
              break;

            case 'pt':
              this.csvData = this.records.map(record => ({
                "Fatura": record.bill_code,
                "Data": record.fecha,
                "Estabelecimento": record.branch_office_name,
                "Operador": record.operator,
                "Auto-tanque": record.plate,
                "Densidade": record.densidad,
                "Temperatura": record.temperatura,
                "Massa aplicada": record.masaTotal,
                "Volume": record.volumenTotal,
                "Total": record.total,
                "Estado": record.status,
              }))
              break;

            default:
              break;
          }

        } else {
          this.toastr.info(response.message);
        }
      }
    );
  }

  drawChart(labels: any, data: any) {
    var data: any;

    setTimeout(() => {

      // Si el gráfico ya existe, destrúyelo antes de crear uno nuevo
      if (this.chart) {
        this.chart.destroy();
      }


      let seriesName = '';
      let titleTextGLP = '';
      let titleTextDate = '';
      let titleTextMass = '';

      switch (this.languageService.getLanguage()) {
        case 'es':
          seriesName = 'Masa aplicada';
          titleTextGLP = `Registro de GLP entregado`;
          titleTextDate = `Fecha (dd/mm/aa)`;
          titleTextMass = `Masa aplicada (kg)`;
          break;

        case 'en':
          seriesName = 'Applied mass';
          titleTextGLP = `GLP delivery record`;
          titleTextDate = `Date (dd/mm/yy)`;
          titleTextMass = `Applied mass (kg)`;
          break;

        case 'pt':
          seriesName = 'Massa aplicada';
          titleTextGLP = `Registro de entrega de GLP`;
          titleTextDate = `Data (dd/mm/aa)`;
          titleTextMass = `Massa aplicada (kg)`;
          break;
      
        default:
          break;
      }

      this.chartOptions = {
        series: [
          {
            name: seriesName,
            data: data,
          }
        ],
        chart: {
          height: 350,
          type: 'line',
          stacked: false

        },
        title: {
          text: titleTextGLP,
          style: {
            color: "#8b8b8b",
            fontWeight: "bold",
          }
        },
        xaxis: {
          categories: labels,
          labels: {
            rotate: -45, // Rota las etiquetas -45 grados
            trim: true, // Trunca las etiquetas si son demasiado largas
            style: {
              colors: "#8b8b8b",
              fontSize: "8px"
            }
          },
          title: {
            text: titleTextDate,
            style: {
              color: "#103C5D",
            }
          },
          axisBorder: {
            show: true,
            color: "#103C5D"
          },
          tickAmount: 10, // Limita el número de etiquetas mostradas a 8
        },
        yaxis: {
          labels: {
            formatter: function (val: number) {
              return val.toFixed(2);
            },
            style: {
              colors: "#8b8b8b",
              fontSize: "10px"
            }
          },
          title: {
            text: titleTextMass,
            style: {
              color: "#FF1654"
            }
          },
          axisBorder: {
            show: true,
            color: "#FF1654"
          },
        },
        stroke: {
          curve: 'smooth',
          colors: ["#053050"],
        },
      };
    }, 0);
  }

  drawChartBar() {
    setTimeout(() => {
      // Si el gráfico ya existe, destrúyelo antes de crear uno nuevo
      if (this.chartBar) {
        this.chartBar.destroy();
      }

      let labels = [...new Set(this.records.map((record: { branch_office_name: string }) => record.branch_office_name))];
      let data = labels.map(label => this.records.filter((record: { branch_office_name: string }) => record.branch_office_name === label).length);

      // Crea un array de objetos que contienen label y data
      let labelDataPairs = labels.map((label, index) => ({
        label: label,
        data: data[index]
      }));

      // Ordena el array en orden descendente por data
      labelDataPairs.sort((a, b) => b.data - a.data);

      // Extrae las etiquetas y los datos ordenados
      let sortedLabels = labelDataPairs.map(pair => pair.label);
      let sortedData = labelDataPairs.map(pair => pair.data);

      // Generar un color "frío" aleatorio para cada etiqueta
      let backgroundColors = sortedLabels.map(() => this.randomColor().transparent);
      let borderColors = sortedLabels.map(() => this.randomColor().opaque);

      let labelText = '';
      switch (this.languageService.getLanguage()) {
        case 'es': 
          labelText = ' Cargues por establecimiento';  
          break;

        case 'en':
          labelText = ' Loads per establishment';
          break;

        case 'pt':
          labelText = ' Cargas por estabelecimento';
          break;
      
        default:
          break;
      }

      this.chartBar = new Chart(this.chartRefBar.nativeElement, {
        type: 'bar',
        data: {
          labels: sortedLabels,
          datasets: [{
            label: labelText,
            data: sortedData,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            barPercentage: 0.35,
          }]
        },
        options: {
          animation: {
            duration: 1000 // general animation time
          },
          scales: {
            x: {
              ticks: {
                display: false
              }
            }
          }
        }
      });
    }, 0);
  }

  drawChartBar2() {
    setTimeout(() => {
      // Si el gráfico ya existe, destrúyelo antes de crear uno nuevo
      if (this.chartBar2) {
        this.chartBar2.destroy();
      }

      let labels = [...new Set(this.records.map((record: { operator: string }) => record.operator))];
      let data = labels.map(label => this.records.filter((record: { operator: string }) => record.operator === label).length);

      // Crea un array de objetos que contienen label y data
      let labelDataPairs = labels.map((label, index) => ({
        label: label,
        data: data[index]
      }));

      // Ordena el array en orden descendente por data
      labelDataPairs.sort((a, b) => b.data - a.data);

      // Extrae las etiquetas y los datos ordenados
      let sortedLabels = labelDataPairs.map(pair => pair.label);
      let sortedData = labelDataPairs.map(pair => pair.data);

      // Generar un color "frío" aleatorio para cada etiqueta
      let backgroundColors = sortedLabels.map(() => this.randomColor().transparent);
      let borderColors = sortedLabels.map(() => this.randomColor().opaque);

      let labelText = '';
      switch (this.languageService.getLanguage()) {
        case 'es': 
          labelText = ' Cargues por operador';  
          break;

        case 'en':
          labelText = ' Loads per operator';
          break;

        case 'pt':
          labelText = ' Cargas por operador';
          break;
      
        default:
          break;
      }

      this.chartBar2 = new Chart(this.chartRefBar2.nativeElement, {
        type: 'bar',
        data: {
          labels: sortedLabels,
          datasets: [{
            label: labelText,
            data: sortedData,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            barPercentage: 0.35,
          }]
        },
        options: {
          animation: {
            duration: 1000 // general animation time
          },
          indexAxis: 'y',
          scales: {
            y: {
              ticks: {
                display: false
              }
            }
          }
        }
      });
    }, 0);
  }

  exportToPDF() {
    const data = document.getElementById('contentToConvert');
    if (data !== null) {
      domtoimage.toPng(data)
        .then((imgData: string) => {
          const pdf = new jsPDF('l', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 2, -3, pdfWidth, pdfHeight);
          pdf.save(`${this.reportXlsMonthForm.value.start} - ${this.reportXlsMonthForm.value.start}.pdf`);
        })
        .catch((error: Error) => {
          console.error('Oops, something went wrong!', error);
        });
    } else {
      console.error('Elemento no encontrado');
    }
  }

  randomColor() {
    let r = Math.floor(Math.random() * 156); // valores entre 0-155
    let g = Math.floor(Math.random() * 156); // valores entre 0-155
    let b = Math.floor(Math.random() * 156 + 100); // valores entre 100-255
    let a = 0.2; // opacidad
    return {
      opaque: 'rgb(' + r + ',' + g + ',' + b + ')',
      transparent: 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
    };
  }

  exportToExcelAll() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.csvData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.reportXlsMonthForm.value.start} - ${this.reportXlsMonthForm.value.end}.xlsx`);
  }

  exportToExcelPaginator() {
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    const exportData = this.csvData.slice(start, end);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.reportXlsMonthForm.value.start} - ${this.reportXlsMonthForm.value.end} (${this.paginator.pageSize}).xlsx`);
  }

  sortData(column: string) {
    this.column = column;
    this.records.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0; // Los valores son iguales
    });
  }

  getKeys(obj: any) {
    if (obj) {
      return Object.keys(obj);
    } else {
      return [];
    }
  }

  toHome() {
    this.router.navigate(['/poseidon/reports/list']);
  }
}
