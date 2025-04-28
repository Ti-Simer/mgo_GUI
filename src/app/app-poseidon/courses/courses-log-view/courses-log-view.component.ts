import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-courses-log-view',
  templateUrl: './courses-log-view.component.html',
  styleUrls: ['./courses-log-view.component.scss'],
  providers: [DatePipe] // Proveer DatePipe
})
export class CoursesLogViewComponent {
  @Input() courselogId!: string;
  data: any;
  ordersOnCourse: any[] = [];
  ordersCompleted: any[] = [];

  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private authService: AuthService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.findCourseLog();
  }

  findCourseLog() {
    this.courseService.findCourseLogById(this.courselogId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.data = response.data;

          this.ordersOnCourse = response.data.orders.filter((order: any) => order.status === 'EN CURSO').map((order: any) => {
            return order
          });

          this.ordersCompleted = response.data.orders.filter((order: any) => order.status === 'FINALIZADO').map((order: any) => {
            return order
          });

        } else {
          console.error(response.message);
        }
      }
    )
  }

  downloadData() {
    const translations = {
      es: {
        vehicle: 'Vehículo:',
        lastUpdate: 'Última actualización:',
        headers: {
          resume: [
            'Pedidos',
            'Entregas',
            'Masa total (Kg)',
            'Volumen total (Gl)',
            'Responsable',
            'Programado'
          ],
          orders: `Pedidos (folio-nombre)`,
          order_status: [
            'En curso',
            'Finalizado',
          ]
        }
      },
      en: {
        vehicle: 'Vehicle:',
        lastUpdate: 'Last update:',
        headers: {
          resume: [
            'Orders',
            'Deliveries',
            'Total mass (Kg)',
            'Total volume (Gl)',
            'Responsible',
            'Scheduled'
          ],
          orders: `Orders (folio-name)`,
          order_status: [
            'In progress',
            'Completed',
          ]
        }
      },
      pt: {
        vehicle: 'Veículo:',
        lastUpdate: 'Última atualização:',
        headers: {
          resume: [
            'Pedidos',
            'Entregas',
            'Masa total (Kg)',
            'Volumen total (Gl)',
            'Responsable',
            'Programado'
          ],
          orders: `Pedidos (folio-nombre)`,
          order_status: [
            'Em progresso',
            'Concluído',
          ]
        }
      }
    };

    // Obtener idioma y validar
    const lang = this.languageService.getLanguage() as keyof typeof translations;
    const translation = translations[lang] || translations['en'];
    const formattedDate = this.datePipe.transform(this.data.courseLog.update, 'medium');


    // Extraer datos comunes
    const reportValues = {
      vehicle: `${translation.vehicle} ${this.data.courseLog.plate}_${this.data.courseLog.operator}`,
      lastUpdate: `${translation.lastUpdate} ${formattedDate}`,
      resume: [
        this.data.courseLog.orders.length,
        this.data.courseLog.charges,
        this.data.courseLog.delivered_mass,
        this.data.courseLog.delivered_volume,
        this.data.courseLog.creator,
        this.data.courseLog.scheduling_date,
      ],
      orders_on_course: this.data.orders.filter((order: any) => order.status === 'EN CURSO').map((order: any) => {
        return `${order.folio}-${order.branch_office.name}`;
      }),
      orders_completed: this.data.orders.filter((order: any) => order.status === 'FINALIZADO').map((order: any) => {
        return `${order.folio}-${order.branch_office.name}`;
      })
    };

    // Construir estructura de datos
    const ws_data = [
      [reportValues.vehicle], // Arreglo con un solo elemento
      [reportValues.lastUpdate], // Arreglo con un solo elemento
      [
        translation.headers.resume[0],
        translation.headers.resume[1],
        translation.headers.resume[2],
        translation.headers.resume[3],
        translation.headers.resume[4],
        translation.headers.resume[5]
      ], // Arreglo con múltiples elementos
      [
        reportValues.resume[0],
        reportValues.resume[1],
        reportValues.resume[2],
        reportValues.resume[3],
        reportValues.resume[4],
        reportValues.resume[5]
      ], // Arreglo con múltiples elementos
      [translation.headers.orders], // Arreglo con un solo elemento
      [
        translation.headers.order_status[0],
        translation.headers.order_status[1]
      ], // Arreglo con múltiples elementos
      [
        reportValues.orders_on_course.join('\n'),
        reportValues.orders_completed.join('\n')
      ] // Arreglo con dos elementos
    ];

    // Crear worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // // Combinar celdas (se mantiene igual)
    const mergeRules: XLSX.Range[] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
    ];
    ws['!merges'] = mergeRules;


    // Configurar anchos de columnas
    ws['!cols'] = [
      { wch: 25 }, { wch: 20 }, { wch: 20 },
      { wch: 20 }, { wch: 20 }
    ];


    // // Exportar CON configuración de estilos
    const filename = `course_log_${this.data.courseLog.plate}_${this.data.courseLog.operator}.xlsx`;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    XLSX.writeFile(wb, filename, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true // Habilitar estilos
    });
  }

  // Función auxiliar para aplicar estilos
  private applyBoldStyleWithFix(ws: XLSX.WorkSheet, row: number, cols: number[]) {
    cols.forEach(col => {
      const cell = XLSX.utils.encode_cell({ r: row, c: col });
      if (!ws[cell]) ws[cell] = { t: 's', v: '' };
      ws[cell].s = {
        font: { bold: true },
        alignment: { horizontal: 'center' }
      };
    });
  }

}
