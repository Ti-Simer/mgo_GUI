import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/poseidon-services/request.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { BillService } from 'src/app/services/poseidon-services/bill.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogViewBillComponent } from '../../reports/bills/dialog-view-bill/dialog-view-bill.component';

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.scss']
})
export class RequestViewComponent {
  private languageSubscription!: Subscription;
  currencyCode: string = 'COP'; // Valor predeterminado

  requestId: any;
  request: any;

  service_time: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private billService: BillService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toRequest();
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });

    this.route.params.subscribe(params => {
      this.requestId = authService.decryptData(params['id']);
    });
  }

  ngOnInit(): void {
    this.getRequest();
    this.currencyCode = this.languageService.detectRegionAndSetCurrency();
  }

  getRequest() {
    this.requestService.getById(this.requestId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.request = response.data;
        } else {
          this.toastr.warning('Ha ocurrido un error al consultar el servicio', 'Advertencia!', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'increasing',
            closeButton: true,
            enableHtml: true
          });
          console.log(response.message);
          this.toRequest();
        }
      }, error => {
        this.toastr.error('Ha ocurrido un error al consultar el servicio', 'Error!', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          closeButton: true,
          enableHtml: true
        });
        console.log(error);
      }
    );
  }

  findBillByFolio() {
    const billData = {
      "folio": this.request.folio,
      "fechaInicial": this.request.data_series.fechaInicial
    }

    this.billService.findByFolio(billData).subscribe(response => {
      console.log(response);
      if (response.statusCode == 200) {
        if (response.data) {
          this.authService.readChecker().subscribe(flag => {
            if (!flag) {
              this.toastr.warning('No tienes permisos para leer esta información');
            } else {
              const dialogRef = this.dialog.open(DialogViewBillComponent, {
                width: '700px',
                data: { billId: response.data.id }
              });
            }
          });
        } else {
          this.toastr.warning('No se encontró la factura', 'Advertencia!', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'increasing',
            closeButton: true,
            enableHtml: true
          });
        }
      } else {
        this.toastr.warning('Ha ocurrido un error al consultar la factura', 'Advertencia!', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          closeButton: true,
          enableHtml: true
        });
        console.log(response.message);
      }
    });

  }

  validate_geofence(): string {
    return this.request.order.validate_geofence ? this.translate.instant('Sí') : this.translate.instant('No');
  }

  validate_token(): string {
    return this.request.order.validate_token ? this.translate.instant('Sí') : this.translate.instant('No');
  }

  exportToExcel() {
    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();

    // Aplanar el objeto JSON
    const flattenedRequest = this.flattenObject(this.request);

    // Convertir los datos a una hoja de trabajo
    const ws = XLSX.utils.json_to_sheet([flattenedRequest]);

    // Añadir la hoja de trabajo al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Descargar el libro de trabajo
    XLSX.writeFile(wb, 'request.xlsx');
  }

  flattenObject(ob: any) {
    var toReturn: { [key: string]: any } = {};

    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if ((typeof ob[i]) == 'object' && ob[i] !== null) {
        var flatObject = this.flattenObject(ob[i]);
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }

  toRequest() {
    this.router.navigate(['/poseidon/request/list']);
  }

}
