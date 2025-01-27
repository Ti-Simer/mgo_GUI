import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CityService } from 'src/app/services/poseidon-services/city.service';
import { DepartmentService } from 'src/app/services/poseidon-services/department.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateDepartmentComponent } from '../../department/dialog-create-department/dialog-create-department.component';
import { LoadingSmallDialogComponent } from 'src/app/dialog/loading-small-dialog/loading-small-dialog.component';

const geocoder = new google.maps.Geocoder();

@Component({
  selector: 'app-city-create',
  templateUrl: './city-create.component.html',
  styleUrls: ['./city-create.component.scss']
})
export class CityCreateComponent {
  private languageSubscription!: Subscription;
  private loadingDialogRef!: MatDialogRef<LoadingSmallDialogComponent>;

  @ViewChild('mapContainer', { static: false }) googleMapElement!: ElementRef;
  @ViewChild('geoCode') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda

  mapCenter: google.maps.LatLngLiteral = { lat: 1.2087372960431741, lng: -77.28992195706844 };
  markerVisible = false;
  markerPosition!: google.maps.LatLngLiteral;

  cityForm: FormGroup;
  departments: any[] = [];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private cityService: CityService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CityCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.cityForm = this.formBuilder.group({
      name: [null, Validators.required],
      department: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
    });

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toCities();
        toastr.warning('No tienes permisos para crear');
      }
    });
  }

  ngOnInit(): void {
    this.fetchDepartments();
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
        }
      });
    }
  }

  // Método para manejar el clic en el mapa
  onMapClick(event: google.maps.MapMouseEvent): void {
    var lat = event.latLng!.lat();
    var lng = event.latLng!.lng();

    // Actualiza la ubicación en el formulario
    this.cityForm.patchValue({ latitude: `${lat}` });
    this.cityForm.patchValue({ longitude: `${lng}` });

    // Actualiza la posición del marcador y lo muestra
    this.markerPosition = { lat, lng };
    this.markerVisible = true;
  }

  fetchDepartments() {
    this.departmentService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.departments = response.data
        }
      }, (error) => {
        console.error('Ha ocurrido un error al obtener los departamentos: ', error);
      }
    );
  }

  onDepartmentSelectionChange(id: any) {
    this.cityForm.value.department = id;
  }

  onSubmit() {
    if (this.cityForm.valid) {
      this.cityService.create(this.cityForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`Ciudad ${response.data.name} creada satisfactoriamente`, `Exito`);
            this.dialogRef.close();
          } else {
            this.toastr.error(response.message, 'ha ocurrido un problema al crear la ciudad');
          }
        }, (error) => {
          console.error('Ha ocurrido un error al crear la ciudad: ', error);
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
    this.router.navigate(['/poseidon/city/list']);
  }

}
