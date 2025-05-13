import { Component } from '@angular/core';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-log-report-list-map',
  templateUrl: './log-report-list-map.component.html',
  styleUrls: ['./log-report-list-map.component.scss']
})
export class LogReportListMapComponent {
  data: any;

  mapCenter: google.maps.LatLngLiteral = { lat: 1.2073352562168826, lng: -77.28305456161672 };
  markers: any[] = [];
  zoom: any = 14;

  constructor(
    private shareService: ShareService
  ) { }


  ngOnInit(): void {
    // Suscribirse al servicio de emisión de datos de datos
    this.receiveData();
  }

  receiveData() {
    this.shareService.secondData$.subscribe(data => {
      this.data = data;
      
      if (this.data) {
        // Crear un array de objetos con los atributos deseados
        const formattedData = this.data.map((item: any) => ({
          plate: item.plate,
          latitude: item.last_latitude,
          longitude: item.last_longitude,
          criticality: item.last_criticality,
        }));

        // Itera a través de los waypoints y crea los marcadores y modos de transporte
        for (const location of formattedData) {

          switch (location.criticality) {
            case 0:
              this.markers.push({
                position: {
                  lat: parseFloat(location.latitude),
                  lng: parseFloat(location.longitude),
                },
                icon: {
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="368.000000pt" height="701.000000pt" viewBox="0 0 368.000000 701.000000"
                    preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,701.000000) scale(0.100000,-0.100000)"
                    fill="#198754" stroke="none">
                    <path d="M1676 2585 c-96 -20 -159 -42 -246 -85 -434 -217 -618 -750 -410
                    -1188 75 -158 160 -256 335 -387 172 -129 267 -240 390 -455 82 -144 107 -145
                    186 -7 124 218 234 345 409 474 204 150 320 315 377 532 34 130 36 306 5 434
                    -80 327 -332 582 -657 668 -104 27 -293 34 -389 14z m300 -546 c267 -100 317
                    -466 88 -642 -57 -43 -155 -77 -224 -77 -69 0 -167 34 -224 77 -178 137 -197
                    401 -39 558 106 107 255 138 399 84z"/>
                    </g>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="100" font-weight="bold" fill="#014e87" stroke="white" stroke-width="0.5" font-family="system-ui">
                      ${location.plate}
                    </text>
                    </svg>
                  `)}`,
                  scaledSize: new google.maps.Size(125, 125),
                }
              });
              break;

            case 1:
              this.markers.push({
                position: {
                  lat: parseFloat(location.latitude),
                  lng: parseFloat(location.longitude),
                },
                icon: {
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="368.000000pt" height="701.000000pt" viewBox="0 0 368.000000 701.000000"
                    preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,701.000000) scale(0.100000,-0.100000)"
                    fill="#f09d04" stroke="none">
                    <path d="M1676 2585 c-96 -20 -159 -42 -246 -85 -434 -217 -618 -750 -410
                    -1188 75 -158 160 -256 335 -387 172 -129 267 -240 390 -455 82 -144 107 -145
                    186 -7 124 218 234 345 409 474 204 150 320 315 377 532 34 130 36 306 5 434
                    -80 327 -332 582 -657 668 -104 27 -293 34 -389 14z m300 -546 c267 -100 317
                    -466 88 -642 -57 -43 -155 -77 -224 -77 -69 0 -167 34 -224 77 -178 137 -197
                    401 -39 558 106 107 255 138 399 84z"/>
                    </g>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="100" font-weight="bold" fill="#014e87" stroke="white" stroke-width="1" font-family="system-ui">
                      ${location.plate}
                    </text>
                    </svg>
                  `)}`,
                  scaledSize: new google.maps.Size(125, 125),
                }
              });
              break;

            case 2:
              this.markers.push({
                position: {
                  lat: parseFloat(location.latitude),
                  lng: parseFloat(location.longitude),
                },
                icon: {
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="368.000000pt" height="701.000000pt" viewBox="0 0 368.000000 701.000000"
                    preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,701.000000) scale(0.100000,-0.100000)"
                    fill="#ff0000" stroke="none">
                    <path d="M1676 2585 c-96 -20 -159 -42 -246 -85 -434 -217 -618 -750 -410
                    -1188 75 -158 160 -256 335 -387 172 -129 267 -240 390 -455 82 -144 107 -145
                    186 -7 124 218 234 345 409 474 204 150 320 315 377 532 34 130 36 306 5 434
                    -80 327 -332 582 -657 668 -104 27 -293 34 -389 14z m300 -546 c267 -100 317
                    -466 88 -642 -57 -43 -155 -77 -224 -77 -69 0 -167 34 -224 77 -178 137 -197
                    401 -39 558 106 107 255 138 399 84z"/>
                    </g>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="100" font-weight="bold" fill="#014e87" stroke="white" stroke-width="1" font-family="system-ui">
                      ${location.plate}
                    </text>
                    </svg>
                  `)}`,
                  scaledSize: new google.maps.Size(125, 125),
                }
              });
              break;

            default:
              break;
          }
        }
      }

      if (this.markers.length > 0) {
        if (this.markers[0].position.lat && this.markers[0].position.lng) {
          this.mapCenter = {
            lat: parseFloat(this.markers[0].position.lat),
            lng: parseFloat(this.markers[0].position.lng)
          }
          this.zoom = 10;
        }
      }
      //this.getMarkerPosition(this.markers[0]); // Centra el mapa en el primer marcador

    });
  }

  //Centra la posición del mapa en el marcador seleccionado
  getMarkerPosition(marker: any) {
    if (marker) {
      this.mapCenter = {
        lat: parseFloat(marker.position.lat),
        lng: parseFloat(marker.position.lng)
      }
      this.zoom = 9;
    }
  }

}
