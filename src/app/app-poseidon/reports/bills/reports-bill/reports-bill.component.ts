import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BillService } from 'src/app/services/poseidon-services/bill.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reports-bill',
  templateUrl: './reports-bill.component.html',
  styleUrls: ['./reports-bill.component.scss']
})
export class ReportsBillComponent {
  private languageSubscription!: Subscription;
  @Input() billId: any;
  currencyCode: string = 'COP';

  bill: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private billService: BillService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
  }

  ngOnInit(): void {
    this.getBill();
    this.currencyCode = this.languageService.detectRegionAndSetCurrency();
  }

  getBill() {
    this.billService.getById(this.billId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.bill = response.data;          
        } else {
          this.toastr.error(response.message, `Ha ocurrido un problema al consultar la factura:`);
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un problema al consultar la factura: ${error}`);
      }
    );
  }

  calcularTotal() {

  }

  printBill() {
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 6
    };
    html2canvas(DATA!, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 60;
      const bufferY = 0;
      const imgProps = (doc as any).getImageProperties(img);
  
      //const pdfWidth = imgProps.width;
      //const pdfHeight = imgProps.height;
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Aumenta el tamaño de la imagen en el papel
      const imageX = bufferX; // Posición X de la imagen
      const imageY = bufferY; // Posición Y de la imagen
      const imageWidth = pdfWidth ; // Ancho de la imagen
      const imageHeight = pdfHeight ; // Alto de la imagen

      doc.addImage(img, 'PNG', imageX, imageY, imageWidth, imageHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`remision-${this.bill.bill_code}.pdf`);
    });
  }

  printMobileBill() {
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 4 // Ajustar la escala para que se adapte mejor
    };
    html2canvas(DATA!, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
  
      // Add image Canvas to PDF
      const bufferY = 20;
      const imgProps = (doc as any).getImageProperties(img);
  
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferY;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      // Ajustar la imagen para que quepa en una sola página
      const imageY = bufferY; // Posición Y de la imagen
      let imageWidth = pdfWidth; // Ancho de la imagen
      let imageHeight = pdfHeight; // Alto de la imagen
  
      // Verificar si la imagen cabe en una sola página
      if (imageHeight > doc.internal.pageSize.getHeight() - 2 * bufferY) {
        // Ajustar la escala para que la imagen quepa en una sola página
        const scale = (doc.internal.pageSize.getHeight() - 2 * bufferY) / imageHeight;
        imageWidth *= scale;
        imageHeight *= scale;
      }
  
      // Calcular la posición X para centrar la imagen
      const imageX = (doc.internal.pageSize.getWidth() - imageWidth) / 2;
  
      doc.addImage(img, 'PNG', imageX, imageY, imageWidth, imageHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`remision-${this.bill.bill_code}.pdf`);
    });
  }

  toViewReports() {
    this.router.navigate(['/poseidon/reports/bills/', this.authService.encryptData(this.bill.branch_office_code)]);
  }

}


