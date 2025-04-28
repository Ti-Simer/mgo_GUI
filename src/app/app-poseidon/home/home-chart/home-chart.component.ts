import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { CourseService } from 'src/app/services/poseidon-services/course.service';

@Component({
  selector: 'app-home-chart',
  templateUrl: './home-chart.component.html',
  styleUrls: ['./home-chart.component.scss'],
})
export class HomeChartComponent implements AfterViewInit, OnDestroy {
  private myChart: Chart<'polarArea'> | undefined;
  data: any[] = [];

  constructor(private courseService: CourseService) { 
    this.courseService.findForHome().subscribe(
      response => {
        if (response.statusCode === 200) {
          this.data = response.data;
        }
      }
    );
  }

  ngAfterViewInit() {
    this.courseService.findForHome().subscribe(
      response => {
        if (response.statusCode === 200) {          
          this.data = response.data;
          this.createChart(); // Llama a createChart después de recibir los datos
        }
      }
    );
    window.addEventListener('resize', this.resizeChart.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeChart.bind(this));
    if (this.myChart) {
      this.myChart.destroy();
    }
  }

  createChart() {
      if (!this.data) {
        return;
      }
  
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      if (!ctx) {
        console.error('Canvas element not found');
        return;
      }
  
      const labels = this.data.map((item: any) => `${item.operator} (${item.propane_truck})`);
      const efficiencies = this.data.map((item: any) => item.efficiency);
  
      const chartData = {
        labels: labels,
        datasets: [{
          label: `Cargues efectuados (%)`,
          data: efficiencies,
          backgroundColor: [
            'rgba(255, 99, 132, 0.4)', // Red with transparency
            'rgba(75, 192, 192, 0.4)', // Green with transparency
            'rgba(255, 205, 86, 0.4)', // Yellow with transparency
            'rgba(201, 203, 207, 0.4)', // Grey with transparency
            'rgba(54, 162, 235, 0.4)'  // Blue with transparency
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)', // Red border
            'rgba(75, 192, 192, 1)', // Green border
            'rgba(255, 205, 86, 1)', // Yellow border
            'rgba(201, 203, 207, 1)', // Grey border
            'rgba(54, 162, 235, 1)'  // Blue border
          ],
          borderWidth: 1
        }]
      };
  
      const config: ChartConfiguration<'polarArea'> = {
        type: 'polarArea',
        data: chartData,
        options: {
          scales: {
            r: {
              grid: {
                color: 'white' // Color de las líneas del gráfico
              },
              angleLines: {
                color: 'white' // Color de las líneas del gráfico
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Eficiencia de Cargues por Operador'
            }
          }
        }
      };
  
      if (this.myChart) {
        this.myChart.destroy();
      }
  
      this.myChart = new Chart(ctx, config);
    }

  resizeChart() {
    if (this.myChart) {
      this.myChart.resize();
    }
  }
}