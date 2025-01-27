import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResDataService } from 'src/app/services/hercules-services/res-data.service';
import { LanguageService } from 'src/app/services/language.service';
import { Chart } from 'chart.js';
import { DialogService } from 'src/app/services/dialog.service';
import { LoadingSmallDialogComponent } from 'src/app/dialog/loading-small-dialog/loading-small-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeviceService } from 'src/app/services/hercules-services/device.service';
import * as XLSX from 'xlsx';
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
  selector: 'app-resume-data',
  templateUrl: './resume-data.component.html',
  styleUrls: ['./resume-data.component.scss']
})
export class ResumeDataComponent {
  public chartOptions!: ChartOptions;
  private loadingDialogRef!: MatDialogRef<LoadingSmallDialogComponent>;
  @ViewChild('chartPie') private chartRef!: ElementRef;
  @Input() sensorData!: any;

  chartForm: FormGroup;

  chart: any;
  chartPie: any;
  sensor_data: any;
  device: any;
  labels: any = [
    { name: 500 },
    { name: 1000 },
    { name: 2500 },
  ]

  constructor(
    private resDataService: ResDataService,
    private deviceService: DeviceService,
    private languageService: LanguageService,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.chartForm = this.formBuilder.group({
      labels: [500],
      text: [15],
      types: ['line']
    });
  }

  ngOnInit(): void {
    this.initializeSensorData();
  }

  async initializeSensorData() {
    try {
      this.sensor_data = await this.fetchResData();
      this.device = await this.getDevice();
      console.log('device::', this.device);

      this.chartForm.valueChanges.subscribe(changes => {
        // Si el gráfico ya existe, destrúyelo
        if (this.chart) {
          this.chart.destroy();
        }
        // Recalcula las etiquetas con el nuevo valor del formulario
        const lastLabels = this.sensor_data.res_data.map((data: any) => data.fecha).slice(- + this.chartForm.value.labels);
        const lastData = this.sensor_data.res_data.map((data: any) => data.nivel).slice(- + this.chartForm.value.labels);

        this.drawChart(lastLabels, lastData);
      });

      // Recalcula las etiquetas con el nuevo valor del formulario
      const lastLabels = this.sensor_data.res_data.map((data: any) => data.fecha).slice(- + this.chartForm.value.labels);
      const lastData = this.sensor_data.res_data.map((data: any) => data.nivel).slice(- + this.chartForm.value.labels);
      this.drawChart(lastLabels, lastData);

    } catch (error) {
      console.error('Error al inicializar los datos del sensor:', error);
    }
  }

  getDevice(): Promise<any> {
    const data = {
      id_device: this.sensorData.id_device,
      sensor: this.sensorData.sensor
    };

    return new Promise((resolve, reject) => {
      this.deviceService.findUserById(data.id_device).subscribe(
        response => {
          if (response.statusCode === 200) {
            resolve(response.data);
          } else {
            this.toastr.warning('No se han encontrado device', 'Advertencia!');
            reject('No se han encontrado device');
          }
        },
        error => {
          this.toastr.error('Error al obtener device', 'Error');
          reject(error);
        }
      );
    });

  }

  fetchResData(): Promise<any> {
    const data = {
      id_device: this.sensorData.id_device,
      sensor: this.sensorData.sensor
    };

    return new Promise((resolve, reject) => {
      this.resDataService.findBySensor(data).subscribe(
        response => {
          if (response.statusCode === 200) {
            resolve(response.data);
          } else {
            this.toastr.warning('No se han encontrado datos', 'Advertencia!');
            reject('No se han encontrado datos');
          }
        },
        error => {
          this.toastr.error('Error al obtener datos', 'Error');
          reject(error);
        }
      );
    });
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
          seriesName = 'Nivel';
          titleTextGLP = `Registro de nivel en tanque`;
          titleTextDate = `Fecha (dd/mm/aa)`;
          titleTextMass = `Porcentaje (%)`;
          break;

        case 'en':
          seriesName = 'Level';
          titleTextGLP = `Tank level record`;
          titleTextDate = `Date (dd/mm/yy)`;
          titleTextMass = `Percentage (%)`;
          break;

        case 'pt':
          seriesName = 'Nível';
          titleTextGLP = `Registro de nível no tanque`;
          titleTextDate = `Data (dd/mm/aa)`;
          titleTextMass = `Porcentagem (%)`;
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

    //this.loadingDialogRef.close();
  }

  downloadCourse() {
    // Define workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let ws_data: any[] = [];

    // Define worksheet data
    switch (this.languageService.getLanguage()) {
      case 'es':
        ws_data = [
          [`SENSOR: ${this.device.observacion} ${this.sensorData.sensor} | Imei: ${this.device.imei}`],
          [`Promedio Alto: ${this.sensor_data.resume_info.average_above_50} | Promedio Bajo: ${this.sensor_data.resume_info.average_below_50}` ],
          [`Promedio Nivel: ${this.sensor_data.resume_info.average_nivel} | Promedio Recarga: ${this.sensor_data.resume_info.average_days_between_recharges} (DD:HH)` ],
          [
            'Fecha',
            'Nivel',
            'Señal',
          ]
        ];
        break;

      case 'en':
        ws_data = [
          [`SENSOR: ${this.device.observacion} ${this.sensorData.sensor} | Imei: ${this.device.imei}`],
          [`Average high level: ${this.sensor_data.resume_info.average_above_50} | Average low level: ${this.sensor_data.resume_info.average_below_50}` ],
          [`Average level: ${this.sensor_data.resume_info.average_nivel} | Average refills: ${this.sensor_data.resume_info.average_days_between_recharges} (DD:HH)` ],
          [
            'Date',
            'Nivel',
            'Signal',
          ]
        ];
        break;

      case 'pt':
        ws_data = [
          [`SENSOR: ${this.device.observacion} ${this.sensorData.sensor} | Imei: ${this.device.imei}`],
          [`Promedio Alto: ${this.sensor_data.resume_info.average_above_50} | Promedio Bajo: ${this.sensor_data.resume_info.average_below_50}` ],
          [`Promedio Nivel: ${this.sensor_data.resume_info.average_nivel} | Promedio Recarga: ${this.sensor_data.resume_info.average_days_between_recharges} (DD:HH)` ],
          [
            'Data',
            'Nível',
            'Sinal',
          ]
        ];
        break;

      default:
        break;
    }

    // Add rows for each branch office
    for (let item of this.sensor_data.res_data) {
      ws_data.push([
        item.fecha,
        item.nivel,
        item.senal,
      ]);
    }

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write workbook to file
    XLSX.writeFile(wb, `${this.device.observacion}_(${this.sensorData.sensor})_${this.device.imei}.xls`);
  }
}
