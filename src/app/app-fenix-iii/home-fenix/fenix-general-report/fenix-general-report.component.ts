import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/fenix-services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';

import * as moment from 'moment';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

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
  selector: 'app-fenix-general-report',
  templateUrl: './fenix-general-report.component.html',
  styleUrls: ['./fenix-general-report.component.scss']
})
export class FenixGeneralReportComponent {
  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  @ViewChild('chartBar2') private chartRefBar2!: ElementRef;
  @ViewChild('chartBar') private chartRefBar!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [100, 500, 1000, 2500]; // Opciones de tamaño de página
  pageSize: number = 100; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  public chartOptions!: ChartOptions;
  selectedStart: any;
  selectedEnd: any;

  reportXlsMonthForm: FormGroup;
  xlsForm: FormGroup;

  records: any[] = [];
  headers: any;
  csvData: any;
  csvDataAll: any;

  chart: any;
  chartPie: any;
  chartBar: any;
  chartBar2: any;
  chartForm: FormGroup;

  lastData: any[] = [];
  lastLabels: any[] = [];
  text: any = [];
  
  dates: any[] = [];
  masa_aplicada: any[] = [];
  packagedKg: any[] = [];
  avg_masa_aplicada: any;
  avg_masa_aplicada_per_capacity: any;
  avg_kilos_aplicados: any;
  packaging_scales: any;
  total_Masa_aplicada: any;
  total_Masa_aplicada_per_capacity: any;
  total_data_per_capacity: any;
  total_remanente: any;
  avg_remanente: any;
  operators: any;
  moda: any;
  column: any;

  groupedRecords: any;

  labels: any = [ 
    { name: 500 },
    { name: 1000 },
    { name: 2500 },
  ]


  graphs: any = [
    {
      name: "Filtros y exportación de archivos",
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: DataService,
    private router: Router
  ) {
    this.reportXlsMonthForm = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      time_start: [''],
      time_end: [''],
    });

    this.xlsForm = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });

    this.chartForm = this.formBuilder.group({
      labels: [500],
      text: [15],
      types: ['line']
    });
  }

  ngOnInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }

    this.chartForm.valueChanges.subscribe(changes => {
      // Si el gráfico ya existe, destrúyelo
      if (this.chart) {
        this.chart.destroy();
      }

      // Filtra los registros y extrae la masa aplicada, tara y peso inicial
      this.lastData = this.records
        .filter(record => record.capacidad === Number(this.chartForm.value.text))
        .map(record => record.masa_aplicada);
      let tara = this.records
        .filter(record => record.capacidad === Number(this.chartForm.value.text))
        .map(record => record.tara);
      let peso_inicial = this.records
        .filter(record => record.capacidad === Number(this.chartForm.value.text))
        .map(record => record.peso_inicial);
      let fecha = this.records
        .filter(record => record.capacidad === Number(this.chartForm.value.text))
        .map(record => record.fecha);

      let result = peso_inicial
        .map((item, index) => item - tara[index])
        .filter(item => item >= 0 && item <= 1);

      this.total_remanente = result.reduce((a, b) => a + b, 0);
      this.avg_remanente = this.total_remanente / result.length;

      this.total_Masa_aplicada_per_capacity = this.lastData.reduce((a, b) => a + b, 0);
      this.total_data_per_capacity = this.lastData.length;

      for (let i = 0; i < this.lastData.length; i++) {
        let sum = this.lastData.reduce((a, b) => a + b, 0);
        this.avg_masa_aplicada_per_capacity = sum / this.lastData.length;
      }

      // Recalcula las etiquetas con el nuevo valor del formulario
      this.lastLabels = fecha.slice(- + this.chartForm.value.labels);
      this.lastData = this.lastData.slice(- + this.chartForm.value.labels);

      this.drawChart(this.lastLabels, this.lastData);
    });
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

  convertToDate(dateString: string): Date {
    let [day, month, year] = dateString.split("/");
    return new Date(`${month}/${day}/${year}`);
  }

  convertTo24Hour(time: string): string {
    return moment(time, ["h:mm A"]).format("HH:mm:ss");
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

  reset() {
    this.xlsForm.reset();
    // this.getCsvData();
  }

  exportToPDF() {
    const data = document.getElementById('contentToConvert');
    if (data !== null) {
      domtoimage.toPng(data)
        .then((imgData: string) => {
          const pdf = new jsPDF('l', 'mm', 'a5');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 2.2, -3, pdfWidth, pdfHeight);
          pdf.save(`${this.reportXlsMonthForm.value.start} - ${this.reportXlsMonthForm.value.start}.pdf`);
        })
        .catch((error: Error) => {
          console.error('Oops, something went wrong!', error);
        });
    } else {
      console.error('Elemento no encontrado');
    }
  }

  exportToExcelAll() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.records);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.reportXlsMonthForm.value.start} - ${this.reportXlsMonthForm.value.end}.xlsx`);
  }

  exportToExcelPaginator() {
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    const exportData = this.records.slice(start, end);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.reportXlsMonthForm.value.start} - ${this.reportXlsMonthForm.value.end} (${this.paginator.pageSize}).xlsx`);
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

    this.dataService.generateCsvByMonth(this.reportXlsMonthForm.value).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.total_Masa_aplicada = response.data.totalMasaAplicada;
          this.headers = response.data.headers;
          this.records = response.data.records.sort((a: any, b: any) => {
            let dateA = this.convertToDate(a.fecha);
            let dateB = this.convertToDate(b.fecha);
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });

          if (this.records) {

            let counts: { [key: number]: number } = {};

            for (let i = 0; i < this.records.length; i++) {
              let shortDate = this.records[i].fecha.slice(2, 16);
              this.dates.push(shortDate);

              this.masa_aplicada.push(this.records[i].masa_aplicada);
              let sum = this.masa_aplicada.reduce((a, b) => a + b, 0);
              this.avg_masa_aplicada = sum / this.masa_aplicada.length;
            }

            this.records[0].total_masa_aplicada = this.total_Masa_aplicada;

            this.groupedRecords = this.records.reduce((acc, record) => {
              if (!acc[record.capacidad]) {
                acc[record.capacidad] = {
                  exito: { count: 0, kilos: 0 },
                  fracaso: { count: 0, kilos: 0 },
                  presurizado: { count: 0, kilos: 0 },
                  total_cilindros: 0,
                  total_kilos: 0
                };
              }

              if (record.estado === 'Éxito') {
                acc[record.capacidad].exito.count += 1;
                acc[record.capacidad].exito.kilos += record.masa_aplicada;
              } else if (record.estado === 'Fracaso') {
                acc[record.capacidad].fracaso.count += 1;
                acc[record.capacidad].fracaso.kilos += record.masa_aplicada;
              } else if (record.estado === 'Cilindro presurizado') {
                acc[record.capacidad].presurizado.count += 1;
                acc[record.capacidad].presurizado.kilos += record.masa_aplicada;
              }

              acc[record.capacidad].total_cilindros += 1;
              acc[record.capacidad].total_kilos += record.masa_aplicada;

              return acc;
            }, {});

            let keys = Object.keys(this.groupedRecords);
            this.text = keys.map(key => ({ name: Number(key) }));

            this.packaging_scales = [...new Set(this.records.map((record: { id_bascula: string }) => record.id_bascula))];
            this.operators = [...new Set(this.records.map((record: { operario: string }) => record.operario))];

            // Filtra los registros y extrae la masa aplicada, tara y peso inicial
            this.lastData = this.records
              .filter(record => record.capacidad === Number(this.chartForm.value.text))
              .map(record => record.masa_aplicada);
            let tara = this.records
              .filter(record => record.capacidad === Number(this.chartForm.value.text))
              .map(record => record.tara);
            let peso_inicial = this.records
              .filter(record => record.capacidad === Number(this.chartForm.value.text))
              .map(record => record.peso_inicial);

            let result = peso_inicial
              .map((item, index) => item - tara[index])
              .filter(item => item >= 0 && item <= 1);

            this.total_remanente = result.reduce((a, b) => a + b, 0);
            this.avg_remanente = this.total_remanente / result.length;

            this.total_Masa_aplicada_per_capacity = this.lastData.reduce((a, b) => a + b, 0);
            this.total_data_per_capacity = this.lastData.length;

            for (let i = 0; i < this.lastData.length; i++) {
              let sum = this.lastData.reduce((a, b) => a + b, 0);
              this.avg_masa_aplicada_per_capacity = sum / this.lastData.length;
            }

            // Recalcula las etiquetas con el nuevo valor del formulario
            this.lastLabels = this.dates.slice(- + this.chartForm.value.labels);
            this.lastData = this.lastData.slice(- + this.chartForm.value.labels);

            this.drawChart(this.lastLabels, this.lastData);
            this.drawChartBar();
            this.drawChartBar2();
          }

          const csv = Papa.unparse({
            fields: this.headers,
            data: this.records
          });

          this.csvData = csv;

        } else {
          this.toastr.info(response.message);
        }
      },
      error => {
        this.toastr.error(
          `Ha ocurrido un error al consultar las facturas ${error}`
        )
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

      this.chartOptions = {
        series: [
          {
            name: 'Masa aplicada',
            data: data,
          }
        ],
        chart: {
          height: 350,
          type: 'line',
          stacked: false

        },
        title: {
          text: `Registro de capacidad ${this.chartForm.value.text}kg (${this.total_data_per_capacity})`,
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
            text: "Fecha (dd/mm/aa)",
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
            text: "Masa aplicada (kg)",
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

      let labels = [...new Set(this.records.map((record: { id_bascula: string }) => record.id_bascula))];
      let data = labels.map(label => this.records.filter((record: { id_bascula: string }) => record.id_bascula === label).length);

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
      let backgroundColors = sortedLabels.map(() => this.randomColor());

      this.chartBar = new Chart(this.chartRefBar.nativeElement, {
        type: 'bar',
        data: {
          labels: sortedLabels,
          datasets: [{
            label: ' Envasados por id_bascula',
            data: sortedData,
            backgroundColor: backgroundColors,
            barPercentage: 0.35,
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

  drawChartBar2() {
    setTimeout(() => {
      // Si el gráfico ya existe, destrúyelo antes de crear uno nuevo
      if (this.chartBar2) {
        this.chartBar2.destroy();
      }

      let labels = [...new Set(this.records.map((record: { capacidad: string }) => record.capacidad))];
      let data = labels.map(label => this.records.filter((record: { capacidad: string }) => record.capacidad === label).length);

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
      let backgroundColors = sortedLabels.map(() => this.randomColor());

      this.chartBar2 = new Chart(this.chartRefBar2.nativeElement, {
        type: 'bar',
        data: {
          labels: sortedLabels,
          datasets: [{
            label: ' Envasados por capacidad',
            data: sortedData,
            backgroundColor: backgroundColors,
            barPercentage: 0.35,
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

  randomColor() {
    let r = Math.floor(Math.random() * 156); // valores entre 0-155
    let g = Math.floor(Math.random() * 156); // valores entre 0-155
    let b = Math.floor(Math.random() * 156 + 100); // valores entre 100-255
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  toHome() {
    this.router.navigate(['/fenix']);
  }

  toGeneralReport() {
    this.router.navigate(['/fenix/general-report']);
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
    return Object.keys(obj);
  }

}
