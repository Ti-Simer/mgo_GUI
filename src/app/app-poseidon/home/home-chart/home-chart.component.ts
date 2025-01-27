import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BillService } from 'src/app/services/poseidon-services/bill.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-home-chart',
  templateUrl: './home-chart.component.html',
  styleUrls: ['./home-chart.component.scss'],
})
export class HomeChartComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: ChartOptions; // Nota el uso de '!' para indicar que siempr
  chartOptions2: any;

  chartForm: FormGroup;

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

  types: any = [
    { name: 'line' },
    { name: 'bar' },
    { name: 'area' },
  ]

  bills: any;
  totals: any[] = [];
  mass: any[] = [];
  density: any[] = [];
  dates: any[] = [];
  temperature: any[] = [];
  volume: any[] = [];
  lastLabels: any[] = [];
  lastData: any[] = [];

  constructor(
    private billService: BillService,
    private formBuilder: FormBuilder
  ) {
    this.chartForm = this.formBuilder.group({
      labels: [25],
      text: ['Ventas efectuadas'],
      types: ['line']
    });
  }

  // @ViewChild('chart') private chartRef!: ElementRef;
  // chart: any;

  ngOnInit() {
    this.fetchBills();

    // Suscríbete a los cambios del formulario aquí, fuera de fetchBills
    this.chartForm.valueChanges.subscribe(changes => {
      // Si el gráfico ya existe, destrúyelo
      if (this.chart) {
        this.chart.destroy();
      }

      switch (this.chartForm.value.text) {
        case 'Kilos cargados':
          this.lastData = this.mass.slice(- + this.chartForm.value.labels);
          break;

        case 'Ventas efectuadas':
          this.lastData = this.totals.slice(- + this.chartForm.value.labels);
          break;

        case 'Densidad':
          this.lastData = this.density.slice(- + this.chartForm.value.labels);
          break;

        case 'Temperatura':
          this.lastData = this.temperature.slice(- + this.chartForm.value.labels);
          break;

        case 'Volúmen':
          this.lastData = this.volume.slice(- + this.chartForm.value.labels);
          break;

        default:
          break;
      }

      // Recalcula las etiquetas con el nuevo valor del formulario
      this.lastLabels = this.dates.slice(- + this.chartForm.value.labels);

      // Dibuja el gráfico con las nuevas etiquetas
      this.drawChart(this.lastLabels, this.lastData, this.chartForm.value.types);
    });
  }

  convertToDate(dateString: string): Date {
    let [day, month, year] = dateString.split("/");
    return new Date(`${month}/${day}/${year}`);
  }

  fetchBills() {
    this.billService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.bills = response.data.sort((a: any, b: any) => {
            let dateA = this.convertToDate(a.charge.fechaInicial);
            let dateB = this.convertToDate(b.charge.fechaInicial);
            return dateA.getTime() - dateB.getTime(); // Ordena en orden ascendente
          });

          for (let i = 0; i < this.bills.length; i++) {
            this.totals.push(this.bills[i].total);
            this.mass.push(this.bills[i].charge.masaTotal);
            this.density.push(this.bills[i].charge.densidad);
            this.temperature.push(this.bills[i].charge.temperatura);
            this.volume.push(this.bills[i].charge.volumenTotal);
            this.dates.push(this.bills[i].charge.fechaInicial);
          }

          if (this.dates) {
            this.lastLabels = this.dates.slice(- + this.chartForm.value.labels); // Obtiene los últimos 10 elementos
            this.lastData = this.totals.slice(- + this.chartForm.value.labels); // Obtiene los últimos 10 elementos

            this.drawChart(this.lastLabels, this.lastData, this.chartForm.value.types);
          }
        }
      }, error => {
        console.log(error);
      }
    );
  }

  drawChart(labels: any, data: any, type: any) {
    var data: any;
    setTimeout(() => {

      // Si el gráfico ya existe, destrúyelo antes de crear uno nuevo
      if (this.chart) {
        this.chart.destroy();
      }

      this.chartOptions = {
        series: [
          {
            name: this.chartForm.value.text,
            data: data,
          }
        ],
        chart: {
          height: 350,
          type: type
        },
        title: {
          text: `${this.chartForm.value.text} de los últimos ${this.chartForm.value.labels} días`
        },
        xaxis: {
          categories: labels,
          labels: {
            rotate: 0, // Rota las etiquetas -45 grados
            trim: false, // Trunca las etiquetas si son demasiado largas
          },
          tickAmount: 8, // Limita el número de etiquetas mostradas a 8
        },
        stroke: {
          curve: 'smooth',
        },
      };
    }, 0);
  }

}