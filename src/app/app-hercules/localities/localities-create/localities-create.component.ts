import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingSmallDialogComponent } from 'src/app/dialog/loading-small-dialog/loading-small-dialog.component';
import { LocalitiesService } from 'src/app/services/hercules-services/localities.service';
import { DevicesService } from 'src/app/services/hercules-services/devices.service';
import { StorageTanksService } from 'src/app/services/hercules-services/storage-tanks.service';

@Component({
  selector: 'app-localities-create',
  templateUrl: './localities-create.component.html',
  styleUrls: ['./localities-create.component.scss']
})
export class LocalitiesCreateComponent {
  private languageSubscription!: Subscription;
  private loadingDialogRef!: MatDialogRef<LoadingSmallDialogComponent>;

  @ViewChild('mapContainer', { static: false }) googleMapElement!: ElementRef;
  @ViewChild('geoCode') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda

  mapCenter: google.maps.LatLngLiteral = { lat: 1.2087372960431741, lng: -77.28992195706844 };
  markerVisible = false;
  markerPosition!: google.maps.LatLngLiteral;

  localityForm: FormGroup;
  localities: any[] = [];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private localitiesService: LocalitiesService,
    private devicesService: DevicesService,
    private storageTanksService: StorageTanksService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<LocalitiesCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.localityForm = this.formBuilder.group({
      name: [null, Validators.required],
      parent_id: [null],
      imei: [null],
      serial: [null],
      device: [null],
      aforo: [null],
      if_parent: false,
      if_device: false,
    });

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toCities();
        toastr.warning('No tienes permisos para crear');
      }
    });
  }

  ngOnInit(): void {
    this.fetchLocalities();
  }

  fetchLocalities() {
    this.localitiesService.findAll().subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.localities = response.data;
      }
    });
  }

  onParentSelectionChange(id: any) {
    this.localityForm.value.parent_id = id;
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

  onSubmit() {
    let dataLocality: any = {};
    let dataDevice: any = {};
    let dataStorageTank: any = {};

    if (this.localityForm.value.name) {
      dataLocality.name = this.localityForm.value.name;
    }

    if (this.localityForm.value.if_parent == true) {
      if (this.localityForm.value.parent_id) {
        dataLocality.parent_id = this.localityForm.value.parent_id;
      }
    }

    if (!dataLocality.name) {
      this.toastr.warning('Debe ingresar un nombre');
      return;
    }

    if (this.localityForm.value.if_parent == true && !this.localityForm.value.imei) {
      this.toastr.warning('Debe ingresar un IMEI');
      return;
    }

    if (this.localityForm.value.if_parent == true && this.localityForm.value.if_device == true && !this.localityForm.value.serial) {
      this.toastr.warning('Debe ingresar un serial');
      return;
    }

    if (this.localityForm.value.if_parent == true && this.localityForm.value.if_device == true && !this.localityForm.value.aforo) {
      this.toastr.warning('Debe ingresar el aforo del tanque');
      return;
    }

    this.localitiesService.create(dataLocality).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.toastr.success('Localidad creada correctamente');
          if (this.localityForm.value.if_device == true) {
            dataDevice.imei = this.localityForm.value.imei;
            dataDevice.location = response.data.id

            this.devicesService.create(dataDevice).subscribe(
              response => {
                if (response.statusCode == 200) {
                  this.toastr.success('Dispositivo creado correctamente');
                  dataStorageTank.serial = this.localityForm.value.serial;
                  dataStorageTank.device = response.data.id;
                  dataStorageTank.aforo = this.localityForm.value.aforo;

                  this.storageTanksService.create(dataStorageTank).subscribe(
                    response => {
                      if (response.statusCode == 200) {
                        this.toastr.success('Tanque de almacenamiento creado correctamente');
                      }
                    });
                }
              });
          }
          this.dialogRef.close();
        }
      }
    );

  }

  toCities() {
    this.router.navigate(['/poseidon/city/list']);
  }
}
