import { Component, ViewChild, OnInit, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TabletService } from 'src/app/services/poseidon-services/tablet.service';

declare var google: any;

@Component({
  selector: 'app-home-trackingmap',
  templateUrl: './home-trackingmap.component.html',
  styleUrls: ['./home-trackingmap.component.scss']
})
export class HomeTrackingmapComponent implements OnInit, OnDestroy {
  isPortrait: boolean = window.matchMedia('(orientation: portrait)').matches;

  private subscription!: Subscription;
  tablets: any;

  zoom: any = 12;
  markers: any[] = [];
  mapCenter: google.maps.LatLngLiteral = { lat: 1.2073352562168826, lng: -77.28305456161672 };

  // Define una matriz de modos de transporte para cada marcador
  travelModes: google.maps.TravelMode[] = [];
  @ViewChild('map') map: any; // Esta es la referencia al mapa

  constructor(
    private authService: AuthService,
    private tabletService: TabletService,
  ) { }

  ngOnInit() {
    this.fetchTablets();
    this.checkOrientation();
    window.matchMedia('(orientation: portrait)').addEventListener('change', this.checkOrientation.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkOrientation();
  }

  checkOrientation() {
    this.isPortrait = window.matchMedia('(orientation: portrait)').matches;
  }

  fetchTablets() {
    const polling$ = interval(10500);

    // Cada vez que el Observable emite un valor, realiza una consulta a tu backend
    this.subscription = polling$
      .pipe(switchMap(() => this.tabletService.getAll()))
      .subscribe(
        response => {
          if (response.statusCode === 200) {
            this.tablets = response.data;

            // Reinicia los marcadores y modos de transporte antes de agregar nuevos
            this.markers = [];
            this.travelModes = [];

            // Itera a través de los waypoints y crea los marcadores y modos de transporte
            for (const location of this.tablets) {
              this.markers.push({
                position: {
                  lat: parseFloat(location.latitude),
                  lng: parseFloat(location.longitude),
                },
                label: `${location.operator[0].firstName} ${location.operator[0].lastName}`
              });

              // Define el modo de transporte para este marcador (ajusta según tus necesidades)
              this.travelModes.push(google.maps.TravelMode.WALKING); // Ejemplo: modo a pie
            }

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
}