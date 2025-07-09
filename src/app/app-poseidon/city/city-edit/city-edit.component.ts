import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CityService } from 'src/app/services/poseidon-services/city.service';
import { DepartmentService } from 'src/app/services/poseidon-services/department.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateDepartmentComponent } from '../../department/dialog-create-department/dialog-create-department.component';

const geocoder = new google.maps.Geocoder();

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent {
  private languageSubscription!: Subscription;

  @ViewChild('mapContainer', { static: false }) googleMapElement!: ElementRef;
  @ViewChild('geoCode') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  @Input() cityId!: string;

  mapCenter: google.maps.LatLngLiteral = { lat: 1.2087372960431741, lng: -77.28992195706844 };
  markerVisible = false;
  markerPosition!: google.maps.LatLngLiteral;

  departments: any
  updateForm: FormGroup
  city: any;
  selectedTab: 'map' | 'latlang' = 'map';
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private cityService: CityService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CityEditComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.updateForm = this.formBuilder.group({
      name: [null, Validators.required],
      department: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
    });

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toCities();
        toastr.warning('No tienes permisos para editar');
      }
    });
  }

  ngOnInit(): void {
    this.fetchDepartments();
    this.getCity();
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
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng()
          });
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

    // Actualiza la ubicación en el formulario
    this.updateForm.patchValue({
      latitude: `${lat}`,
      longitude: `${lng}`
    });
  }

  fetchDepartments() {
    this.departmentService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.departments = response.data;
        } else {
          this.toastr.info('Ha ocurrido un problema al consultar los departamentos');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar los departamentos: ', error);
      }
    );
  }

  getCity() {
    this.cityService.getById(this.cityId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.city = response.data

          this.updateForm.patchValue({
            name: this.city.name,
            department: this.city.department[0].id,
            latitude: this.city.latitude,
            longitude: this.city.longitude
          })

          var lat = parseFloat(this.city.latitude);
          var lng = parseFloat(this.city.longitude);

          this.mapCenter = { lat, lng };
          this.markerPosition = { lat, lng };
          this.markerVisible = true;
        } else {
          this.toastr.warning(response.message, 'Ha ocurrido un problema al obtener la ciudad')
        }
      }, (error) => {
        console.error('Ha ocurrido un problema al obtener la ciudad: ', error);
      }
    );
  }

  onSubmit() {
    console.log(this.updateForm.value);


    if (this.updateForm.valid) {
      this.cityService.update(this.cityId, this.updateForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`Ciudad ${response.data.name} se actualizo satisfactoriamente`);
            this.dialogRef.close();
          } else {
            this.toastr.warning('Ha ocurrido un problema al actualizar la ciudad', response.message);
          }
        }, (error) => {
          console.log("Ha ocurrido un error al actualizar la ciudad", error);
        }
      );
    }
  }

  toCreateDepartments() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateDepartmentComponent, {
          width: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchDepartments();
        });
      }
    });
  }

  toCities() {
    this.router.navigate(['/poseidon/city/list'])
  }

}
