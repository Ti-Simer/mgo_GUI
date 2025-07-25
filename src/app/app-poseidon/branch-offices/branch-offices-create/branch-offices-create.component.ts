import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { CityService } from 'src/app/services/poseidon-services/city.service';
import { ClientService } from 'src/app/services/poseidon-services/client.service';
import { FactorService } from 'src/app/services/poseidon-services/factor.service';
import { StationaryTankService } from 'src/app/services/poseidon-services/stationary-tank.service';
import { ZoneService } from 'src/app/services/poseidon-services/zone.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateStationaryTankComponent } from '../../stationary-tank/dialog-create-stationary-tank/dialog-create-stationary-tank.component';
import { DialogCreateClientsComponent } from '../../clients/dialog-create-clients/dialog-create-clients.component';
import { DialogCreateCityComponent } from '../../city/dialog-create-city/dialog-create-city.component';
import { DialogCreateZoneComponent } from '../../zone/dialog-create-zone/dialog-create-zone.component';

const geocoder = new google.maps.Geocoder();

@Component({
  selector: 'app-branch-offices-create',
  templateUrl: './branch-offices-create.component.html',
  styleUrls: ['./branch-offices-create.component.scss']
})

export class BranchOfficesCreateComponent {
  private languageSubscription!: Subscription;

  @ViewChild('mapContainer', { static: false }) googleMapElement!: ElementRef;
  @ViewChild('geoCode') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  @ViewChild('myInput') searchInput2!: ElementRef;


  branchOfficeForm: FormGroup;
  mapCenter: google.maps.LatLngLiteral = { lat: 1.2087372960431741, lng: -77.28992195706844 };
  markerVisible = false;
  clientInput = false;
  markerPosition!: google.maps.LatLngLiteral;
  departments: any;
  cities: any[] = [];
  selectedCity: any;
  zones: any[] = [];
  clients: any[] = [];
  stationaryTanks: any[] = [];
  factor: any;
  radius: any;
  selectedstationaryTank: any[] = [];
  activeClientTab: 'listado' | 'manual' = 'listado';
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private branchOfficesService: BranchOfficesService,
    private cityService: CityService,
    private zoneService: ZoneService,
    private factorService: FactorService,
    private clientService: ClientService,
    private stationaryTankService: StationaryTankService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<BranchOfficesCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.branchOfficeForm = this.formBuilder.group({
      name: [null, Validators.required],
      nit: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      city: [null, Validators.required],
      zone: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      factor: [0],
      client: [null, Validators.required],
      kilogramValue: [null, Validators.required],
      tank_stock: [1, Validators.required],
      stationary_tanks: [null, Validators.required]
    });
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toBranchOffices();
        toastr.warning('No tienes permisos para crear');
      }
    });
  }

  ngOnInit(): void {
    this.fetchCities();
    this.fetchZones();
    this.fetchClients();
    this.fetchStationaryTanks();
  }

  onCityChange(cityId: any) {
    this.findCityById(cityId);
  }

  initializeSearchFilter() {
    if (this.searchInput2) {
      const inputElement = this.searchInput2.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#tableStationaryTanks tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  codeAddress() {
    if (this.searchInput) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      geocoder.geocode({ 'address': value }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0].geometry && results[0].geometry.location) {
          this.mapCenter = results[0].geometry.location;
          this.markerPosition = results[0].geometry.location;
          this.markerVisible = true;
          this.branchOfficeForm.patchValue({
            latitude: `${results[0].geometry.location.lat()}`,
            longitude: `${results[0].geometry.location.lng()}`
          });

          this.geofence(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        }
      });
    }
  }

  // Método para manejar el clic en el mapa
  onMapClick(event: google.maps.MapMouseEvent): void {
    var lat = event.latLng!.lat();
    var lng = event.latLng!.lng();

    // Actualiza la posición del marcador y lo muestra
    this.markerPosition = { lat, lng };
    this.markerVisible = true;

    // Actualiza la geocerca en el formulario
    this.branchOfficeForm.patchValue({
      latitude: `${lat}`,
      longitude: `${lng}`
    });

    this.geofence(lat, lng);
  }

  toggleInputClient() {
    this.clientInput = !this.clientInput;
  }

  fetchClients() {
    this.clientService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.clients = response.data;
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar los clientes ${error}`);
      }
    );
  }

  fetchCities() {
    this.cityService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.cities = response.data;
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar las ciudades', error);
      }
    );
  }

  findCityById(cityId: any) {
    this.cityService.getById(cityId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.mapCenter = { lat: parseFloat(response.data.latitude), lng: parseFloat(response.data.longitude) };

        } else {
          this.toastr.error('Ha ocurrido un error al consultar la ciudad');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar la ciudad', error);
      }
    );
  }

  fetchZones() {
    this.zoneService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.zones = response.data;
        }
      }, (error) => {
        console.error('Ha ocurrido un problema al consultar las zonas', error);
      }
    );
  }

  fetchStationaryTanks() {
    this.stationaryTankService.getAllAvailable().subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.stationaryTanks = response.data;
        }
      },
      (error) => {
        console.error('Ha ocurrido un error al obtener Tanques estacionarios', error);
      }
    );
  }

  onStationaryTankChange(stationaryTank: any) {
    const index = this.selectedstationaryTank.indexOf(stationaryTank.id);

    if (index === -1) {
      // Si no se encuentra en la lista, agrégalo
      this.selectedstationaryTank.push(stationaryTank.id);
    } else {
      // Si ya está en la lista, quítalo
      this.selectedstationaryTank.splice(index, 1);
    }

    // Actualizar el valor del campo 'locations' en el formulario
    this.branchOfficeForm.patchValue({ stationary_tanks: this.selectedstationaryTank });
    this.branchOfficeForm.patchValue({ tank_stock: this.selectedstationaryTank.length });


    if (this.selectedstationaryTank.length < 2) {
      this.branchOfficeForm.patchValue({ general_ticket: false });
    }

    // Marcar el formulario como válido si se han seleccionado locations
    if (this.selectedstationaryTank.length > 0) {
      this.branchOfficeForm.get('stationary_tanks')?.setValidators(Validators.required);
      this.branchOfficeForm.get('stationary_tanks')?.updateValueAndValidity();
    } else {
      this.branchOfficeForm.get('stationary_tanks')?.clearValidators();
      this.branchOfficeForm.get('stationary_tanks')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.branchOfficeForm.valid) {
      const branchOfficeData = this.branchOfficeForm.value;
      // Aqui se registra la sucursal con estado 'ACTIVO' al se generada por administradores
      this.branchOfficesService.create(branchOfficeData).subscribe(
        response => {
          if (response.statusCode === 200) {
            //Muestra una notificación de éxito
            this.toastr.success('Sucursal registrada exitosamente', 'Éxito');
            this.dialogRef.close();
          } else {
            this.toastr.error('Ha ocurrido un problema al crear la sucursal', response.message);
            console.error('Error en el registro la sucursal:', response.message);
          }
        },
        error => {
          console.error('Error en la respuesta del servidor:', error);

          //Muestra una notificación de error
          this.toastr.error(error, 'Ha ocurrido un error');
        }
      );
    }
  }

  toBranchOffices() {
    this.router.navigate(['/poseidon/branch-offices/list']);
  }

  toCreateStationaryTank() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateStationaryTankComponent, {
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchStationaryTanks();
        });
      }
    });
  }

  toCreateClients() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateClientsComponent, {
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchClients();
        });
      }
    });
  }

  toCreateCities() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateCityComponent, {
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchCities();
        });
      }
    });
  }

  toCreateZones() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateZoneComponent, {
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchZones();
        });
      }
    });
  }

  toFactor() {
    this.router.navigate(['/poseidon/factor/edit/', this.factor.id]);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private geofence(lat: any, lng: any) {
    // Define el radio de la geocerca en metros
    this.radius = 100;

    // Define el número de lados del polígono (6 para un hexágono)
    const sides = 6;

    // Calcula el ángulo entre cada punto
    const angleStep = 360 / sides;

    // Inicializa las coordenadas de la geocerca
    const geofenceCoordinates = [];

    // Calcula los puntos en la circunferencia del radio para crear un polígono
    for (let i = 0; i < sides; i++) {
      const degree = i * angleStep;
      const radian = degree * Math.PI / 180;
      const dx = this.radius * Math.cos(radian);
      const dy = this.radius * Math.sin(radian);
      const pointLat = lat + (180 / Math.PI) * (dy / 6378137);
      const pointLng = lng + (180 / Math.PI) * (dx / 6378137) / Math.cos(lat * Math.PI / 180);
      geofenceCoordinates.push({ lat: pointLat, lng: pointLng });
    }
  }
}
