import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { BillService } from 'src/app/services/poseidon-services/bill.service';
import { ReportService } from 'src/app/services/poseidon-services/report.service';
import { LpgPropertiesService } from 'src/app/services/poseidon-services/lpg-properties.service';
import * as XLSX from 'xlsx';
import { ImportLpgPropertiesComponent } from '../import-lpg-properties/import-lpg-properties.component';

@Component({
  selector: 'app-control-inventory',
  templateUrl: './control-inventory.component.html',
  styleUrls: ['./control-inventory.component.scss']
})
export class ControlInventoryComponent {
  controlInventoryForm: FormGroup;
  inventoryReport: FormGroup;
  date: any;
  data: any;

  trucks: any[] = [];
  hasProperties: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private billService: BillService,
    private reportService: ReportService,
    private lpgPropertiesService: LpgPropertiesService,
    private languageService: LanguageService,
    private toastService: ToastrService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.controlInventoryForm = this.formBuilder.group({
      day: [null, Validators.required],
    });

    this.inventoryReport = this.formBuilder.group({
      capacity: [{value: null, disabled: true}, Validators.required],
      capacityGl: [null, Validators.required],
      density: [null, Validators.required],
      plate: [null, Validators.required],
      totalVolume: [null, Validators.required],
      totalMass: [null, Validators.required],
      date: [null, Validators.required],
      observed_pressure_in: [null],
      temperature_in: [null],
      observed_pressure_out: [null],
      temperature_out: [null],
      exit: [null],
      entry: [null],
    });
  }

  ngOnInit() {
    this.has_Properties();
  }

  onSubmit() {
    const data = this.controlInventoryForm.value;
    this.billService.getPlatesByBillDay(data).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.date = response.data.day;
          this.trucks = response.data.propaneTrucks;
          this.toastService.success(response.message);
        } else {
          this.toastService.warning(response.message);
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
      totalMass: truck.totalMass,
      date: this.date
    });
  }
  
  downloadData() {
    const translations = {
      es: {
        vehicle: 'Vehículo:',
        capacityData: 'Datos capacidad',
        headers: {
          capacity: [
            'Capacidad en kilogramos',
            'Capacidad en Galones',
            'Densidad (g/cm³)',
          ],
          calculationExit: `Salida de auto tanque (${this.inventoryReport.value.exit}%)`,
          calculationHeaders: [
            'Volumen vapor (GL)',
            'Volumen liquido (GL)',
            'Volúmen total (GL)',
            'Masa total (KG)'
          ],
          calculationEntry: `Entrada de auto tanque (${this.inventoryReport.value.entry}%)`,
          theoreticalSale: 'Venta teórica',
          saleHeaders: [
            'Volumen teórico (GL)',
            'Volumen real (GL)',
          ]
        }
      },
      en: {
        vehicle: 'Vehicle:',
        capacityData: 'Capacity data',
        headers: {
          capacity: [
            'Capacity in kilograms',
            'Capacity in Gallons',
            'Density (g/cm³)',
          ],
          calculationExit: `Tanker truck exit (${this.inventoryReport.value.exit}%)`,
          calculationHeaders: [
            'Vapor volume (GL)',
            'Liquid volume (GL)',
            'Total volume (GL)',
            'Total mass (KG)'
          ],
          calculationEntry: `Tanker truck entry (${this.inventoryReport.value.entry}%)`,
          theoreticalSale: 'Theoretical sale',
          saleHeaders: [
            'Theoretical volume (GL)',
            'Real volume (GL)',
          ]
        }
      },
      pt: {
        vehicle: 'Veículo:',
        capacityData: 'Dados de capacidade',
        headers: {
          capacity: [
            'Capacidade em quilogramas',
            'Capacidade em Galões',
            'Densidade (g/cm³)',
          ],
          calculationExit: `Saída de auto tanque (${this.inventoryReport.value.exit}%)`,
          calculationHeaders: [
            'Volume de vapor (GL)',
            'Volume líquido (GL)',
            'Volume total (GL)',
            'Massa total (KG)'
          ],
          calculationEntry: `Entrada de auto tanque (${this.inventoryReport.value.entry}%)`,
          theoreticalSale: 'Venda teórica',
          saleHeaders: [
            'Volume teórico (GL)',
            'Volume real (GL)',
          ]
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
        this.inventoryReport.value.density,
      ],
      calculationExit: [
        this.data.exit_calculations.liquid_equivalent_vapor_volume_at_60F,
        this.data.exit_calculations.liquid_volume_at_60F,
        this.data.exit_calculations.total_volume_at_60F,
        this.data.exit_calculations.total_mass
      ],
      calculationEntry: [
        this.data.entry_calculations.liquid_equivalent_vapor_volume_at_60F,
        this.data.entry_calculations.liquid_volume_at_60F,
        this.data.entry_calculations.total_volume_at_60F,
        this.data.entry_calculations.total_mass
      ],
      theoreticalSale: [
        this.data.teoric_sale,
        this.inventoryReport.value.totalVolume
      ]
    };
    
    // Construir estructura de datos
    const ws_data = [
      [reportValues.vehicle],
      [translation.capacityData],
      translation.headers.capacity,
      reportValues.capacityData,
      [translation.headers.calculationExit],
      translation.headers.calculationHeaders,
      reportValues.calculationExit,
      [translation.headers.calculationEntry],
      translation.headers.calculationHeaders,
      reportValues.calculationEntry,
      [translation.headers.theoreticalSale],
      translation.headers.saleHeaders,
      reportValues.theoreticalSale
    ];

    // Crear worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // Combinar celdas (se mantiene igual)
    const mergeRules: XLSX.Range[] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } },
      { s: { r: 7, c: 0 }, e: { r: 7, c: 4 } },
      { s: { r: 10, c: 0 }, e: { r: 10, c: 4 } },
    ];
    ws['!merges'] = mergeRules;

    // Aplicar estilos CORREGIDOS
    this.applyBoldStyleWithFix(ws, 0, [0]);  // Vehicle
    this.applyBoldStyleWithFix(ws, 1, [0]);  // Capacity Data
    this.applyBoldStyleWithFix(ws, 2, [0, 1, 2]);
    this.applyBoldStyleWithFix(ws, 4, [0]);
    this.applyBoldStyleWithFix(ws, 5, [0, 1, 2, 3]);
    this.applyBoldStyleWithFix(ws, 7, [0]);
    this.applyBoldStyleWithFix(ws, 8, [0, 1, 2, 3]);
    this.applyBoldStyleWithFix(ws, 9, [0]);
    this.applyBoldStyleWithFix(ws, 10, [0, 1]);

    // Configurar anchos de columnas
    ws['!cols'] = [
      { wch: 25 }, { wch: 20 }, { wch: 20 },
      { wch: 20 }, { wch: 20 }
    ];


    // Exportar CON configuración de estilos
    const filename = `control_inventory ${this.inventoryReport.value.plate} ${this.date}.xlsx`;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    XLSX.writeFile(wb, filename, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true // Habilitar estilos
    });
  }

  
  has_Properties() {
    this.lpgPropertiesService.hasAny().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.hasProperties = response.data;
        } else {
          this.toastr.warning(response.message);
          console.error(response.message);
        }
      }
    );
  }

  toImportLpgProperties() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(ImportLpgPropertiesComponent, {
          width: '1600px',
        });
        
        dialogRef.afterClosed().subscribe(result => {
          this.has_Properties();
        });
      }
    });
  }

  calculateInventory() {
    if (!this.inventoryReport.value.entry && !this.inventoryReport.value.exit) {
      this.toastService.warning('Debe ingresar los valores de entrada y salida');
      return;
    }
    
    if (this.inventoryReport.value.entry >= this.inventoryReport.value.exit) {
      this.toastService.warning('El valor de entrada debe ser menor al de salida');
      return;
    }

    if (this.inventoryReport.value.entry <= 0 || this.inventoryReport.value.exit > 100) {
      this.toastService.warning('Los valores de entrada deben ser mayores a 0 y los de salida menores a 100');
      return;
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
