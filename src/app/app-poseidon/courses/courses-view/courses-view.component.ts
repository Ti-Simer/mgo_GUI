import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEditCoursesComponent } from '../dialog-edit-courses/dialog-edit-courses.component';


declare var google: any; // Importa la API de Google Maps JavaScript

@Component({
  selector: 'app-courses-view',
  templateUrl: './courses-view.component.html',
  styleUrls: ['./courses-view.component.scss']
})
export class CoursesViewComponent {
  private languageSubscription!: Subscription;
  @Input() courseId: any;

  course: any;
  userId: any;
  user: any;
  zoom: any = 14;

  markers: any[] = [];
  mapCenter: google.maps.LatLngLiteral = { lat: 1.264773397887801, lng: -77.2786796092987 };
  panelOpenState: boolean = false;

  // Define una matriz de modos de transporte para cada marcador
  travelModes: google.maps.TravelMode[] = [];
  @ViewChild('map') map: any; // Esta es la referencia al mapa

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<CoursesViewComponent>,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserFromToken();
    this.getCourseById();
    this.getUser();
  }

  getPanelText(): string {
    return this.panelOpenState ? this.translate.instant('Menos') : this.translate.instant('Más');
  }

  getUser() {
    this.usuarioService.getUserById(this.userId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.user = response.data;
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar el usuario: ', error);
      }
    );
  }

  //Centra la posición del mapa en el marcador seleccionado
  getMarkerPosition(marker: any) {
    this.mapCenter = {
      lat: parseFloat(marker.latitude),
      lng: parseFloat(marker.longitude)
    }
    this.zoom = 16;
  }

  getCourseById() {
    this.courseService.getCourseById(this.courseId).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.course = response.data;
          console.log('Derrotero: ', this.course);

          // Reinicia los marcadores y modos de transporte antes de agregar nuevos
          this.markers = [];
          this.travelModes = [];

          // Itera a través de los waypoints y crea los marcadores y modos de transporte
          for (const location of this.course.orders) {
            this.markers.push({
              position: {
                lat: parseFloat(location.branch_office.latitude),
                lng: parseFloat(location.branch_office.longitude),
              },
              label: {
                text: location.branch_office.name,
                color: '#6e6e6e',
                fontSize: '14px', // Tamaño del texto
                fontWeight: 'bold', // Peso del texto
              },
              icon: {
                url: 'assets/images/map-pin.svg',
                scaledSize: new google.maps.Size(70, 70)
              }
            });

            // Define el modo de transporte para este marcador (ajusta según tus necesidades)
            this.travelModes.push(google.maps.TravelMode.WALKING); // Ejemplo: modo a pie
          }

        } else {
          console.log('Ocurrió un error en la consulta del derrotero');
        }
      },
      (error) => {
        console.log('Ha ocurrido un error al consultar el derrotero', error);
      }
    );
  }

  downloadCourse() {
    // Define workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let ws_data: any[] = [];

    // Define worksheet data
    switch (this.languageService.getLanguage()) {
      case 'es':
        ws_data = [
          [`RUTA: ${this.course.operator.firstName} ${this.course.operator.lastName} Vehiculo: ${this.course.propane_truck.plate}`],
          [
            'Folio',
            'Tipo de Pago',
            'Token',
            'Establecimiento',
            'NIT',
            'Dirección',
            'Contacto',
            'Ubicación',
            'Valor por Kilogramo',
            'Estado'
          ]
        ];
        break;

      case 'en':
        ws_data = [
          [`COURSE: ${this.course.operator.firstName} ${this.course.operator.lastName} Vehiculo: ${this.course.propane_truck.plate}`],
          [
            'Folio',
            'Payment Type',
            'Token',
            'Establishment',
            'NIT',
            'Address',
            'Contact',
            'Location',
            'Value per Kilogram',
            'Status'
          ]
        ];
        break;

      case 'pt':
        ws_data = [
          [`CURSO: ${this.course.operator.firstName} ${this.course.operator.lastName} Vehiculo: ${this.course.propane_truck.plate}`],
          [
            'Fólio',
            'Tipo de Pagamento',
            'Token',
            'Estabelecimento',
            'NIT',
            'Endereço',
            'Contato',
            'Localização',
            'Valor por Quilograma',
            'Estado'
          ]
        ];
        break;

      default:
        break;
    }

    // Add rows for each branch office
    for (let item of this.course.orders) {
      ws_data.push([
        item.folio,
        item.payment_type,
        item.token,
        item.branch_office.name,
        item.branch_office.nit,
        `${item.branch_office.address} ${item.branch_office.city[0].name}`,
        `${item.branch_office.email} / ${item.branch_office.phone}`,
        `${item.branch_office.latitude}, ${item.branch_office.longitude}`,
        item.branch_office.kilogramValue,
        item.status
      ]);
    }

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write workbook to file
    XLSX.writeFile(wb, `${this.course.operator.firstName} ${this.course.operator.lastName} Vehiculo: ${this.course.propane_truck.plate}.xls`);
  }

  deleteCourse() {
    this.dialogService.openConfirmDialog('¿Esta seguro que desea eliminar el derrotero?, recuerde que esta información sera borrada definitivamente')
      .subscribe(result => {
        if (result) {
          this.courseService.delete(this.courseId).subscribe(
            response => {
              if (response.statusCode === 200) {
                this.toastr.info('Derrotero eliminado exitosamente', 'Información');
                this.dialogRef.close();
              } else {
                this.toastr.warning('Ocurrió un error al eliminar el derrotero');
              }
            },
            error => {
              this.toastr.error('Ha ocurrido un error al eliminar el derrotero', error);
            }
          );
        }
      });
  }

  toCourses() {
    if (this.user.role.name === 'Operario') {
      this.router.navigate(['/poseidon/courses/operator']);
    } else {
      this.router.navigate(['/poseidon/courses/admin']);
    }
  }

  toEditCourse() {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditCoursesComponent, {
          width: '1400px',
          data: { courseId: this.courseId }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.getCourseById();
        });
      }
    });
  }

  toHome() {
    this.router.navigate(['/poseidon/home']);
  }

}
