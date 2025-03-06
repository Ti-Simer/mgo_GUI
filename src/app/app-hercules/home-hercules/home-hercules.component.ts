import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/hercules-services/data.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home-hercules',
  templateUrl: './home-hercules.component.html',
  styleUrls: ['./home-hercules.component.scss'],
})
export class HomeHerculesComponent implements OnInit {

  data: any[] = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.findLatestData();
  }

  findLatestData() {
    this.dataService.findLatestData().subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.data = response.data;
      }
    });
  }

  inventoryMethodGeneral() {
    const data = this.data.map(item => {
      return {
        'Fecha de creación': new Date(item.data.create).toLocaleString(),
        'ID': item.device.imei,
        'Ubicación': item.device.location.parent_id ? `${item.device.location.parent_id.name}, ${item.device.location.name}` : item.device.location.name,
        'Temperatura (C°)': item.data.temperature,
        'Presión (PSI)': item.data.pressure,
        'Volumen (GL US)': item.data.volume,
        'Masa (Kg)': item.data.mass,
        'Densidad (g/cm3)': item.data.density,
        'Altura (mm)': item.data.level,
        'Volumen (Lts)': item.data.volume_lt,
        'Volumen (GL)': item.data.volume_gl,
        'Porcentaje (%)': item.data.percent,
        'Red contra incendios': item.data.RCI == '01' ? 'ON' : 'OFF',
        'Válvula-IN': item.data.NVIN == '01' ? 'ON' : 'OFF',
        'Válvula-OUT': item.data.NVOUT == '01' ? 'ON' : 'OFF',
        'Autonomía (Días)': (item.data.percent / 8).toFixed(2) // Calcula la autonomía en días
      }
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Inventario_${fechaActual}.xlsx`.replace(/[\s,]/g, '_'); // Reemplaza espacios y comas por guiones bajos
    
    XLSX.writeFile(wb, nombreArchivo);
  }

  inventoryMethodByIMEI(item: any) {
    const data = [
      {
        'Fecha de creación': new Date(item.data.create).toLocaleString(),
        'ID': item.device.imei,
        'Ubicación': item.device.location.parent_id ? `${item.device.location.parent_id.name}, ${item.device.location.name}` : item.device.location.name,
        'Temperatura (C°)': item.data.temperature,
        'Presión (PSI)': item.data.pressure,
        'Volumen (GL US)': item.data.volume,
        'Masa (Kg)': item.data.mass,
        'Densidad (g/cm3)': item.data.density,
        'Altura (mm)': item.data.level,
        'Volumen (Lts)': item.data.volume_lt,
        'Volumen (GL)': item.data.volume_gl,
        'Porcentaje (%)': item.data.percent,
        'Red contra incendios': item.data.RCI == '01' ? 'ON' : 'OFF',
        'Válvula-IN': item.data.NVIN == '01' ? 'ON' : 'OFF',
        'Válvula-OUT': item.data.NVOUT == '01' ? 'ON' : 'OFF',
        'Autonomía (Días)': (item.data.percent / 8).toFixed(2) // Calcula la autonomía en días
      }
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    const fechaActual = new Date().toISOString().split('T')[0];
    const ubicacion = item.device.location.parent_id ? `${item.device.location.parent_id.name}_${item.device.location.name}` : item.device.location.name;
    const nombreArchivo = `Inventario_${fechaActual}_${ubicacion}.xlsx`.replace(/[\s,]/g, '_'); // Reemplaza espacios y comas por guiones bajos

    XLSX.writeFile(wb, nombreArchivo);
  }

}