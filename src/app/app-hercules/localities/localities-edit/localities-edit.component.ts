import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { DataService } from 'src/app/services/hercules-services/data.service';
import { DevicesService } from 'src/app/services/hercules-services/devices.service';
import { LocalitiesService } from 'src/app/services/hercules-services/localities.service';
import { StorageTanksService } from 'src/app/services/hercules-services/storage-tanks.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-localities-edit',
  templateUrl: './localities-edit.component.html',
  styleUrls: ['./localities-edit.component.scss']
})
export class LocalitiesEditComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @Input() imei!: string;
  @Input() localityId!: string;

  localityForm: FormGroup;
  localities: any[] = [];
  aforo: any[] = [];
  childrens: any[] = [];

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private localitiesService: LocalitiesService,
    private devicesService: DevicesService,
    private storageTanksService: StorageTanksService,
    public dialogRef: MatDialogRef<LocalitiesEditComponent>
  ) {
    this.localityForm = this.formBuilder.group({
      name: [null, Validators.required],
      parent_id: [null],
      imei: [null],
      imei_temp: [null],
      serial: [null],
      serial_temp: [null],
      location: [null],
      aforo: [null],
      children: [null],
      if_parent: false,
      if_device: false,
    });
  }

  ngOnInit(): void {
    if (this.imei) {
      this.findDataByImei();
    } else {
      this.findDataByLocality();
    }

    this.fetchLocalities();
  }

  findDataByImei() {
    this.dataService.findDataByImei(this.imei).subscribe(
      response => {
        if (response.statusCode == 200) {
          const device = response.data.device;
          const storage_tank = response.data.storage_tank;
          this.aforo = storage_tank.aforo;

          this.localityForm.patchValue({
            name: device.location.name,
            imei: device.imei,
            imei_temp: device.imei,
            serial_temp: storage_tank.serial,
            serial: storage_tank.serial,
            aforo: storage_tank.aforo,
            location: device.location.id,
            if_device: true
          });

          if (device.location.parent_id) {
            this.localityForm.patchValue({
              if_parent: true,
              parent_id: device.location.parent_id.id
            });
          } else {
            this.localityForm.patchValue({
              if_parent: false
            });
          }

          if (device.location.children.length > 0) {
            this.childrens = device.location.children;
          }
          
        } else {
          this.toastr.warning(response.message);
        }
      }
    );
  }

  findDataByLocality() {
    this.dataService.findDataByLocality(this.localityId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.localityForm.patchValue({
            name: response.data.name
          });

          if (response.data.children.length > 0) {
            this.childrens = response.data.children;
          }

        } else {
          this.toastr.warning(response.message);
        }
      }
    );
  }

  fetchLocalities() {
    this.localitiesService.findAll().subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.localities = response.data;
      }
    });
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ';', RS: '\n' });

        // Reemplaza los puntos decimales por comas en los porcentajes
        const formattedCsv = csv.replace(/(\d+),(\d+)%/g, '$1.$2%');
        this.localityForm.patchValue({ aforo: formattedCsv });

        // Puedes llamar a tu método para importar los datos aquí
        // this.importNifs(formattedCsv);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  onParentSelectionChange(id: any) {
    this.localityForm.value.parent_id = id;
  }

  updateLocality() {
    const locationData = {
      name: this.localityForm.value.name,
      parent_id: this.localityForm.value.parent_id
    }

    this.localitiesService.update(this.localityId, locationData).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.toastr.success(response.message);
        } else {
          this.toastr.warning(response.message);
        }
      }
    );
  }

  updateDevice() {
    const imei = this.localityForm.value.imei_temp;
    const deviceData = {
      imei: this.localityForm.value.imei,
    }

    this.devicesService.update(imei, deviceData).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.toastr.success(response.message);
        } else {
          this.toastr.warning(response.message);
        }
      }
    );
  }

  updateStorageTank() {
    const serial = this.localityForm.value.serial_temp;
    const storageTankData = {
      serial: this.localityForm.value.serial,
      aforo: this.localityForm.value.aforo,
    }

    this.storageTanksService.update(serial, storageTankData).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.toastr.success(response.message);
        } else {
          this.toastr.warning(response.message);
        }
      }
    );
  }
}
