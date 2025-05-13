import { Component } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
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
  selector: 'app-home-trackingmap',
  templateUrl: './home-trackingmap.component.html',
  styleUrls: ['./home-trackingmap.component.scss']
})

export class HomeTrackingmapComponent {
  public chartOptions!: ChartOptions;
  chart: any;

  data: any = [];

  constructor(
    private languageService: LanguageService,
    private courseService: CourseService,
  ) { }

  ngOnInit() {
    this.searchFiveDaysAgo();
  }

  searchFiveDaysAgo(){
    this.courseService.searchFiveDaysAgo().subscribe(
      response => {
        this.data = response.data;

        // Extraer las fechas y las masas aplicadas
        const labels = this.data.map((item: any) => {
          const date = new Date(`${item.date}T00:00:00`); // Forzar interpretación como fecha local
          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        });
        const data = this.data.map((item: any) => {
          return item.total_delivered_mass;
        });

        // Llamar a la función para dibujar el gráfico
        this.drawChart(labels, data);
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
            color: "#fff",
            fontWeight: "bold",
          }
        },
        xaxis: {
          categories: labels,
          labels: {
            rotate: -45, // Rota las etiquetas -45 grados
            trim: true, // Trunca las etiquetas si son demasiado largas
            style: {
              colors: "#fff",
              fontSize: "8px"
            }
          },
          title: {
            text: titleTextDate,
            offsetY: 10,
            style: {
              color: "#fff",
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
              colors: "#fff",
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

  ngOnDestroy() {
  }
}