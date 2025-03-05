import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from 'src/app/services/language.service';
import { BillService } from 'src/app/services/poseidon-services/bill.service';
import { ReportService } from 'src/app/services/poseidon-services/report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-control-inventory',
  templateUrl: './control-inventory.component.html',
  styleUrls: ['./control-inventory.component.scss']
})
export class ControlInventoryComponent {
  controlInventoryForm: FormGroup;
  inventoryReport: FormGroup;
  date: any;
  trucks: any = [];
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    private billService: BillService,
    private reportService: ReportService,
    private languageService: LanguageService,
    private toastService: ToastrService,
  ) {
    this.controlInventoryForm = this.formBuilder.group({
      day: [null, Validators.required],
    });

    this.inventoryReport = this.formBuilder.group({
      capacity: [null, Validators.required],
      capacityGl: [null, Validators.required],
      capacityTGl: [null, Validators.required],
      density: [null, Validators.required],
      plate: [null, Validators.required],
      totalVolume: [null, Validators.required],
      date: [null, Validators.required],
      entry: [null],
      exit: [null],
    });
  }

  onSubmit() {
    const data = this.controlInventoryForm.value;
    this.billService.getPlatesByBillDay(data).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.date = response.data.day;
          this.trucks = response.data.propaneTrucks;
        }
      }
    );
  }

  onTruckClick(truck: any) {
    this.inventoryReport.patchValue({
      capacity: truck.capacity,
      capacityGl: truck.capacityGl,
      capacityTGl: truck.capacityTGl,
      density: truck.density,
      plate: truck.plate,
      totalVolume: truck.totalVolume,
      date: this.date
    });
  }

  calculateInventory() {
    if (!this.inventoryReport.value.entry && !this.inventoryReport.value.entry) {
      this.toastService.warning('Debe ingresar los valores de entrada y salida');
    }

    try {
      const data = this.inventoryReport.value;

      this.reportService.control_inventory(data).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastService.success('Inventario calculado correctamente');
            this.data = response.data;
          } else {
            this.toastService.error(response.message, 'Error al calcular el inventario');
          }
        }
      );

    } catch (error) {
      this.toastService.error('Error al calcular el inventario');
    }
  }

  downloadData() {
    const translations = {
      es: {
        vehicle: 'Vehículo:',
        capacityData: 'Datos capacidad',
        headers: {
          capacity: [
            'Capacidad en kilogramos',
            'Capacidad en Galones (densidad)',
            'Capacidad en Galones (volumétrico)',
            'Densidad promedio',
            'Volumen total-remisiones'
          ],
          calculationDensity: 'Cálculo con Densidad promedio',
          calculationHeaders: [
            `Salida de auto tanque (${this.data.exit}%)`,
            `Entrada de auto tanque (${this.data.entry}%)`,
            'Entrega (Gl)',
            'Resultado (Gl)'
          ],
          volumetric: 'Cálculo volumétrico (2.02)'
        }
      },
      en: {
        vehicle: 'Vehicle:',
        capacityData: 'Capacity data',
        headers: {
          capacity: [
            'Capacity in kilograms',
            'Capacity in Gallons (density)',
            'Capacity in Gallons (volumetric)',
            'Average density',
            'Total volume-deliveries'
          ],
          calculationDensity: 'Calculation with Average Density',
          calculationHeaders: [
            `Tank truck exit (${this.data.exit}%)`,
            `Tank truck entry (${this.data.entry}%)`,
            'Delivery (Gl)',
            'Result (Gl)'
          ],
          volumetric: 'Volumetric calculation (2.02)'
        }
      },
      pt: {
        vehicle: 'Veículo:',
        capacityData: 'Dados de capacidade',
        headers: {
          capacity: [
            'Capacidade em quilogramas',
            'Capacidade em Galões (densidade)',
            'Capacidade em Galões (volumétrico)',
            'Densidade média',
            'Volume total-remessas'
          ],
          calculationDensity: 'Cálculo com Densidade média',
          calculationHeaders: [
            `Saída do auto tanque (${this.data.exit}%)`,
            `Entrada do auto tanque (${this.data.entry}%)`,
            'Entrega (Gl)',
            'Resultado (Gl)'
          ],
          volumetric: 'Cálculo volumétrico (2.02)'
        }
      }
    };

    // Obtener idioma y validar
    const lang = this.languageService.getLanguage() as keyof typeof translations;
    const translation = translations[lang] || translations['en'];

    // Extraer datos comunes
    const reportValues = {
      vehicle: `${translation.vehicle} ${this.inventoryReport.value.plate}, ${this.date}`,
      capacityData: [
        this.inventoryReport.value.capacity,
        this.inventoryReport.value.capacityGl,
        this.inventoryReport.value.capacityTGl,
        this.inventoryReport.value.density,
        this.inventoryReport.value.totalVolume
      ],
      densityCalculation: [
        this.data.exitGl,
        this.data.entryGl,
        this.data.saleGl,
        this.data.performanceGl
      ],
      volumetricCalculation: [
        this.data.exitTGl,
        this.data.entryTGl,
        this.data.saleTGl,
        this.data.performanceTGl
      ]
    };

    // Construir estructura de datos
    const ws_data = [
      [reportValues.vehicle],
      [translation.capacityData],
      translation.headers.capacity,
      reportValues.capacityData,
      [translation.headers.calculationDensity],
      translation.headers.calculationHeaders,
      reportValues.densityCalculation,
      [translation.headers.volumetric],
      translation.headers.calculationHeaders,
      reportValues.volumetricCalculation
    ];

    // Crear worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // Combinar celdas para los títulos
    const mergeRules: XLSX.Range[] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Fila 1 (A-E)
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Fila 2
      { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } }, // Fila 5
      { s: { r: 7, c: 0 }, e: { r: 7, c: 4 } }  // Fila 8
    ];
    ws['!merges'] = mergeRules;

    // Aplicar estilos a los headers
    const applyBoldStyle = (row: number, cols: number[]) => {
      cols.forEach(col => {
        const cell = XLSX.utils.encode_cell({ r: row, c: col });
        ws[cell].s = { font: { bold: true } };
      });
    };

    // Aplicar negrita a:
    applyBoldStyle(0, [0]);  // Vehicle
    applyBoldStyle(1, [0]);  // Capacity Data
    applyBoldStyle(2, [0, 1, 2, 3, 4]); // Headers capacidad
    applyBoldStyle(4, [0]);  // Calculation Density
    applyBoldStyle(5, [0, 1, 2, 3]); // Calculation Headers
    applyBoldStyle(7, [0]);  // Volumetric
    applyBoldStyle(8, [0, 1, 2, 3]); // Volumetric Headers

    // Resto del código mantiene igual
    const filename = `control_inventory ${this.inventoryReport.value.plate} ${this.date}.xlsx`;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename);
  }
}
