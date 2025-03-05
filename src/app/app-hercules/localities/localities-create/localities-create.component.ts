import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CityService } from 'src/app/services/poseidon-services/city.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingSmallDialogComponent } from 'src/app/dialog/loading-small-dialog/loading-small-dialog.component';
import { LocalitiesService } from 'src/app/services/hercules-services/localities.service';

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
      if_parent: [null],
      if_device: [null],
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
      console.log('Localities::', response);
      if (response.statusCode == 200) {

        this.localities = response.data;
      }
    });
  }

  onParentSelectionChange(id: any) {
    this.localityForm.value.parent_id = id;
  }

  handleFileInput(event: any) { }
  import() { }

  onSubmit() {
    console.log('localityForm::', this.localityForm.value);

    // if (this.localityForm.valid) {
    //   this.cityService.create(this.localityForm.value).subscribe(
    //     response => {
    //       if (response.statusCode == 200) {
    //         this.toastr.success(`Ciudad ${response.data.name} creada satisfactoriamente`, `Exito`);
    //         this.dialogRef.close();
    //       } else {
    //         this.toastr.error(response.message, 'ha ocurrido un problema al crear la ciudad');
    //       }
    //     }, (error) => {
    //       console.error('Ha ocurrido un error al crear la ciudad: ', error);
    //     }
    //   );
    // }
  }

  toCities() {
    this.router.navigate(['/poseidon/city/list']);
  }
}
