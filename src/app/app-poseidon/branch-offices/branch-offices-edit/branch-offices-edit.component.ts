import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DialogCreateCityComponent } from '../../city/dialog-create-city/dialog-create-city.component';
import { DialogCreateZoneComponent } from '../../zone/dialog-create-zone/dialog-create-zone.component';
import { DialogCreateClientsComponent } from '../../clients/dialog-create-clients/dialog-create-clients.component';

const geocoder = new google.maps.Geocoder();

@Component({
  selector: 'app-branch-offices-edit',
  templateUrl: './branch-offices-edit.component.html',
  styleUrls: ['./branch-offices-edit.component.scss']
})
export class BranchOfficesEditComponent {
  private languageSubscription!: Subscription;
  @Input() branchOfficeId!: any;

  @ViewChild('mapContainer', { static: false }) googleMapElement!: ElementRef;
  @ViewChild('geoCode') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  @ViewChild('myInput') searchInput2!: ElementRef;

  branchOffice: any;
  updateForm: FormGroup;
  cities: any[] = [];
  zones: any[] = [];
  clients: any[] = [];
  stationaryTanks: any[] = [];
  factor: any;

  mapCenter: any;
  markerVisible = false;
  clientInput = false;
  markerPosition!: google.maps.LatLngLiteral;
  geofenceCoordinates: any[] = [];
  selectedstationaryTank: any[] = [];
  previousSelectedstationaryTank: any[] = [];
  radius: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private branchOfficesService: BranchOfficesService,
    private factorService: FactorService,
    private cityService: CityService,
    private zoneService: ZoneService,
    private clientService: ClientService,
    private stationaryTankService: StationaryTankService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<BranchOfficesEditComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.updateForm = this.formBuilder.group({
      name: [null, Validators.required],
      nit: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      city: [null, Validators.required],
      zone: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      client: [null, Validators.required],
      kilogramValue: [null, Validators.required],
      tank_stock: [null, Validators.required],
      factor: [0],
      stationary_tanks: [null, Validators.required]
    });
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toBranchOffices();
        toastr.warning('No tienes permisos para editar');
      }
    });
  }

  ngOnInit(): void {
    this.getBranchOfficeById();
    this.fetchCities();
    this.fetchZones();
    this.fetchClients();
  }

  toggleInputClient() {
    this.clientInput = !this.clientInput;
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
          this.updateForm.patchValue({
            latitude: `${results[0].geometry.location.lat()}`,
            longitude: `${results[0].geometry.location.lng()}`
          });

          this.geofence(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        }
      });
    }
  }

  getBranchOfficeById() {
    this.branchOfficesService.getBranchOfficeById(this.branchOfficeId).subscribe(
      (response) => {
        this.branchOffice = response.data;
        this.patchUpdateForm(this.branchOffice);
        this.mapCenter = { lat: parseFloat(this.updateForm.value.latitude), lng: parseFloat(this.updateForm.value.longitude) };
        this.markerPosition = { lat: parseFloat(this.updateForm.value.latitude), lng: parseFloat(this.updateForm.value.longitude) };
        this.markerVisible = true;
        this.geofence(this.updateForm.value.latitude, this.updateForm.value.longitude);
      },
      (error) => {
        console.error('Error al obtener el rol por ID:', error);
      }
    );
  }

  patchUpdateForm(data: any) {
    this.updateForm.patchValue({
      name: data.name,
      nit: data.nit,
      address: data.address,
      city: data.city && data.city.length > 0 ? data.city[0].id : null, // Manejo seguro
      zone: data.zone && data.zone.length > 0 ? data.zone[0].id : null, // Manejo seguro
      client: data.client && data.client.length > 0 ? data.client[0].id : null, // Manejo seguro
      latitude: data.latitude,
      longitude: data.longitude,
      phone: data.phone,
      email: data.email,
      kilogramValue: data.kilogramValue,
      tank_stock: data.tank_stock,
      geofence: data.geofence,
      stationary_tanks: data.stationary_tanks
    });

    this.fetchStationaryTanks();

    if (data.stationary_tanks.length > 0) {
      for (let i = 0; i < data.stationary_tanks.length; i++) {
        this.stationaryTanks.push(data.stationary_tanks[i]);
      }
    }

    this.selectedstationaryTank = this.updateForm.value.stationary_tanks.map((tank: { id: any; }) => tank.id);
    this.previousSelectedstationaryTank = [...this.selectedstationaryTank];
  }

  fetchCities() {
    this.cityService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.cities = response.data
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar las ciudades: ', error);
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
        console.error('Ha ocurrido un error al consultar las zonas: ', error);
      }
    );
  }

  fetchClients() {
    this.clientService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.clients = response.data;
        } else {
          this.toastr.info('No se han registrado clientes');
          this.router.navigate(['/poseidon/client/create']);
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar los clientes ${error}`);
      }
    );
  }

  fetchStationaryTanks() {
    this.stationaryTankService.getAllAvailable().subscribe(
      (response) => {
        if (response.statusCode === 200) {
          for (let i = 0; i < response.data.length; i++) {
            this.stationaryTanks.push(response.data[i]);
          }
        } else {
          console.log('No se han encontrado Tanques estacionarios disponibles:', response.message);
        }
      },
      (error) => {
        console.error('Error al obtener Tanques estacionarios:', error);
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
    this.updateForm.patchValue({ stationary_tanks: this.selectedstationaryTank });
    this.updateForm.patchValue({ tank_stock: this.selectedstationaryTank.length });

    if (this.selectedstationaryTank.length < 2) {
      this.updateForm.patchValue({ general_ticket: false });
    }

    // Marcar el formulario como válido si se han seleccionado locations
    if (this.selectedstationaryTank.length > 0) {
      this.updateForm.get('stationary_tanks')?.setValidators(Validators.required);
      this.updateForm.get('stationary_tanks')?.updateValueAndValidity();
    } else {
      this.updateForm.get('stationary_tanks')?.clearValidators();
      this.updateForm.get('stationary_tanks')?.updateValueAndValidity();
    }
  }

  deselectAllStationaryTanks() {
    // Vaciar la lista de tanques seleccionados
    this.selectedstationaryTank = [];

    // Actualizar el valor del campo 'stationary_tanks' en el formulario
    this.updateForm.patchValue({ stationary_tanks: this.selectedstationaryTank });
    this.updateForm.patchValue({ tank_stock: this.selectedstationaryTank.length });

    // Desactivar el ticket general si no hay tanques seleccionados
    this.updateForm.patchValue({ general_ticket: false });

    // Limpiar las validaciones del campo 'stationary_tanks'
    this.updateForm.get('stationary_tanks')?.clearValidators();
    this.updateForm.get('stationary_tanks')?.updateValueAndValidity();
  }

  // Método para manejar el clic en el mapa
  onMapClick(event: google.maps.MapMouseEvent): void {
    var lat = event.latLng!.lat();
    var lng = event.latLng!.lng();

    // Actualiza la posición del marcador y lo muestra
    this.markerPosition = { lat, lng };
    this.markerVisible = true;

    // Actualiza la geocerca en el formulario
    this.updateForm.patchValue({
      latitude: `${lat}`,
      longitude: `${lng}`
    });

    this.geofence(lat, lng);
  }


  updateBranchOffice() {
    if (this.updateForm.valid) {
      // Verificar si stationary_tanks es un array de objetos con la estructura esperada
      if (Array.isArray(this.updateForm.value.stationary_tanks) && this.updateForm.value.stationary_tanks.length > 0 && typeof this.updateForm.value.stationary_tanks[0] === 'object' && this.updateForm.value.stationary_tanks[0].id) {
        const stationaryTankIds = this.updateForm.value.stationary_tanks.map((tank: { id: any; }) => tank.id);
        this.updateForm.patchValue({ stationary_tanks: stationaryTankIds });
      }

      this.branchOfficesService.updateBranchOffice(this.branchOfficeId, this.updateForm.value).subscribe(
        (response) => {
          console.log(response);

          if (response.statusCode === 200) {
            // Encuentra los tanques estacionarios que han sido desmarcados
            const unselectedstationaryTank = this.previousSelectedstationaryTank.filter(tankId => !this.selectedstationaryTank.includes(tankId));

            if (unselectedstationaryTank.length > 0) {
              this.stationaryTankService.updateMultiple(unselectedstationaryTank).subscribe(
                response => {
                  if (response.statusCode == 200) {
                    console.log('Se han actualizado también los siguientes tanques estacionarios: ', unselectedstationaryTank);
                  } else {
                    console.error('Ha ocurrido un error al actualizar los tanques estacionarios');
                  }
                }
              );
            }

            this.toastr.success(response.message, 'Éxito!');
            this.dialogRef.close();
          } else {
            console.error('Error en la respuesta del servidor:', response.message);
            this.toastr.error('Error en el registro', response.message);
          }
        },
        (error) => {
          console.error('Error al actualizar el rol:', error);
        }
      );
    }
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

  toCreateCities() {
    const dialogRef = this.dialog.open(DialogCreateCityComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchCities();
    });
  }

  toCreateZones() {
    const dialogRef = this.dialog.open(DialogCreateZoneComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchZones();
    });
  }

  toCreateClients() {
    const dialogRef = this.dialog.open(DialogCreateClientsComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchClients();
    });
  }

  toBranchOffices() {
    this.router.navigate(['/poseidon/branch-offices/list']);
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
