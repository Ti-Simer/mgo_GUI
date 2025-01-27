import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TabletService } from 'src/app/services/poseidon-services/tablet.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-tablets-view',
  templateUrl: './tablets-view.component.html',
  styleUrls: ['./tablets-view.component.scss']
})

export class TabletsViewComponent {
  private languageSubscription!: Subscription;

  private subscription!: Subscription;
  
  isLoading = false;
  tabletId: any;
  tablet: any;
  zoom: any = 15;

  markers: any[] = [];
  mapCenter: google.maps.LatLngLiteral = { lat: 1.264773397887801, lng: -77.2786796092987 };

  // Define una matriz de modos de transporte para cada marcador
  travelModes: google.maps.TravelMode[] = [];
  @ViewChild('map') map: any; // Esta es la referencia al mapa

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private tabletService: TabletService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toTablets();
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tabletId = this.authService.decryptData(params['id'])
    });

    console.log('tablet id', this.tabletId);

    //this.startPolling();
    this.findTablet();
  }

  startPolling() {
    // Crea un Observable que emite un valor cada 5 segundos
    const polling$ = interval(500);

    // Cada vez que el Observable emite un valor, realiza una consulta a tu backend
    this.subscription = polling$
      .pipe(switchMap(() => this.tabletService.getById(this.tabletId)))
      .subscribe(
        response => {
          this.tablet = response.data;

          this.mapCenter = {
            lat: parseFloat(this.tablet.latitude),
            lng: parseFloat(this.tablet.longitude)
          }

          this.markers.push({
            position: {
              lat: parseFloat(this.tablet.latitude),
              lng: parseFloat(this.tablet.longitude),
            },
            label: `${this.tablet.operator[0].firstName} ${this.tablet.operator[0].lastName}`
          });
        },
        error => {
          console.error('Error al obtener la tableta:', error);
        }
      );
  }

  findTablet() {
    this.isLoading = true;
    const polling$ = interval(2000);

    // Cada vez que el Observable emite un valor, realiza una consulta a tu backend
    this.subscription = polling$
      .pipe(switchMap(() => this.tabletService.getById(this.tabletId)))
      .subscribe(
        response => {
          this.isLoading = false;
          if (response.statusCode === 200) {
            this.tablet = response.data;

            // Reinicia los marcadores y modos de transporte antes de agregar nuevos
            this.markers = [];
            this.travelModes = [];

            // Itera a través de los waypoints y crea los marcadores y modos de transporte
            this.markers.push({
              position: {
                lat: parseFloat(this.tablet.latitude),
                lng: parseFloat(this.tablet.longitude),
              },
              label: `${this.tablet.operator[0].firstName} ${this.tablet.operator[0].lastName}`
            });

            this.mapCenter = {
              lat: parseFloat(this.tablet.latitude),
              lng: parseFloat(this.tablet.longitude)
            }

            // Define el modo de transporte para este marcador (ajusta según tus necesidades)
            this.travelModes.push(google.maps.TravelMode.WALKING); // Ejemplo: modo a pie


          } else {
            console.log('No se han encontrado ubicaciones');
          }
        },
        (error) => {
          console.log('Ha ocurrido un error al consultar las ubicaciones de tablets', error);
        }
      );
  }

  ngOnDestroy() {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toTablets() {
    this.router.navigate(['/poseidon/tablets/list']);
  }

  toOperator() {
    this.router.navigate(['/poseidon/usuarios/view/' + this.tablet.operator[0].id]);
  }

}
