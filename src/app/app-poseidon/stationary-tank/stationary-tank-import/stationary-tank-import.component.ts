import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { StationaryTankService } from 'src/app/services/poseidon-services/stationary-tank.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatDialogRef } from '@angular/material/dialog';
import { LoadingDialogComponent } from 'src/app/dialog/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-stationary-tank-import',
  templateUrl: './stationary-tank-import.component.html',
  styleUrls: ['./stationary-tank-import.component.scss']
})
export class StationaryTankImportComponent {
  private languageSubscription!: Subscription;
  private loadingDialogRef!: MatDialogRef<LoadingDialogComponent>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  pageSizeOptions: number[] = [100, 500, 1000, 2500]; // Opciones de tamaño de página
  pageSize: number = 100; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  csv: any[] = [];

  constructor(
    private stationaryTankService: StationaryTankService,
    private toastr: ToastrService,
    private router: Router,
    private dialogService: DialogService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toStationaryTanks();
        toastr.warning('No tienes permisos para crear');
      }
    });
  }


  ngOnInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }

    this.initializeSearchFilter();

  }

  initializeSearchFilter() {
    if (this.searchInput) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#myTable tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  // Método para manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.onPageChange(event);
      });
    }
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        this.importNifs(csv);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  importNifs(csv: string) {
    const lines = csv.split('\n');
    const jsonObjects = lines
      .filter(line => line.trim() !== '')  // filter out empty lines
      .slice(1)
      .map(line => {
        let [serial, capacity] = line.split(',');
        serial = serial.replace(/"/g, '').trim();  // remove double quotes and trim
        capacity = capacity.replace(/"/g, '').trim();
        return { serial, capacity };
      });
    this.csv = jsonObjects;
    console.log(this.csv);
  }

  confirmDownloadTemplate() {
    let message = "";
    let title = "";

    switch (this.languageService.getLanguage()) {
      case 'es':
        title = 'Información de Importación, ¿Desea descargar el formato?';
        message = `
        <strong>=== IMPORTACIÓN DE TANQUES ESTACIONARIOS ===</strong><br><br>
        <strong>Serial:</strong> Número de serie del tanque estacionario<br>
        <strong>Capacidad:</strong> capacidad en kilos<br>
      `;
        break;

      case 'en':
        title = 'Import Information, Do you want to download the format?';
        message = `
        <strong>=== IMPORT OF STATIONARY TANKS ===</strong><br><br>
        <strong>Serial:</strong> Serial number of the stationary tank<br>
        <strong>Capacity:</strong> capacity in kilos<br>
      `;
        break;

      case 'pt':
        title = 'Informações de Importação, Deseja baixar o formato?';
        message = `
        <strong>=== IMPORTAÇÃO DE TANQUES ESTACIONÁRIOS ===</strong><br><br>
        <strong>Serial:</strong> Número de série do tanque estacionário<br>
        <strong>Capacidade:</strong> capacidade em quilos<br>
      `;
        break;

      default:
        break;
    }

    this.dialogService.openInfoConfirmDialog(message, title)
      .subscribe(result => {
        if (result) {
          this.generateTemplate();
        }
      });
  }

  generateTemplate() {
    // Define workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Define worksheet data
    const ws_data = [
      ['Serial', 'Capacidad']
    ];

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write workbook to file
    XLSX.writeFile(wb, 'Formato-tanques-estacionarios.xls');
  }

  confirmDownloadConsolidateData() {
    let message = "";
    let title = "";

    switch (this.languageService.getLanguage()) {
      case 'es':
        title = 'Información, ¿Desea descargar el archivo?';
        message = `
        <strong>=== EXPORTACIÓN DE TANQUES ESTACIONARIOS ===</strong>
        <br><br>
        <p> Se exportará un archivo con la siguiente total de los  TANQUES ESTACIONARIOS existentes</p> <br>
        <p> ¿Desea descargar el archivo?</p> <br>
      `;
        break;

      case 'en':
        title = 'Information, Do you want to download the file?';
        message = `
        <strong>=== EXPORT OF STATIONARY TANKS ===</strong>
        <br><br>
        <p> A file with the total of existing STATIONARY TANKS will be exported</p> <br>
        <p> Do you want to download the file?</p> <br>
      `;
        break;

      case 'pt':
        title = 'Informações, Deseja baixar o arquivo?';
        message = `
        <strong>=== EXPORTAÇÃO DE TANQUES ESTACIONÁRIOS ===</strong>
        <br><br>
        <p> Será exportado um arquivo com o total dos TANQUES ESTACIONÁRIOS existentes</p> <br>
        <p> Deseja baixar o arquivo?</p> <br>
      `;
        break;

      default:
        break;
    }

    this.dialogService.openInfoConfirmDialog(message, title)
      .subscribe(result => {
        if (result) {
          this.generateConsolidateData();
        }
      });
  }

  generateConsolidateData() {
    this.stationaryTankService.getAll().subscribe(
      response => {
        if (response.statusCode === 200) {
          const stationary_tanks = response.data;

          // Define workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          // Define worksheet data
          const ws_data = [
            [
              'Serial',
              'Capacidad',
            ]
          ];

          // Add rows for each branch office
          for (let stationary_tank of stationary_tanks) {
            ws_data.push([
              stationary_tank.serial,
              stationary_tank.capacity,
            ]);
          }

          // Create worksheet
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Write workbook to file
          XLSX.writeFile(wb, 'Consolidado-tanques-estacionarios.xls');
        }
      }, (error) => {
        console.error(error);
      });
  }

  infoImport() {
    let message = "";
    let title = "";

    switch (this.languageService.getLanguage()) {
      case 'es':
        title = 'Información de Importación';
        message = `
        <strong>=== IMPORTACIÓN DE TANQUES ESTACIONARIOS ===</strong><br><br>
        <strong>Serial:</strong> Número de serie del tanque estacionario<br>
        <strong>Capacidad:</strong> capacidad en kilos<br>
      `;
        break;

      case 'en':
        title = 'Import Information';
        message = `
        <strong>=== IMPORT OF STATIONARY TANKS ===</strong><br><br>
        <strong>Serial:</strong> Serial number of the stationary tank<br>
        <strong>Capacity:</strong> capacity in kilos<br>
      `;
        break;

      case 'pt':
        title = 'Informações de Importação';
        message = `
        <strong>=== IMPORTAÇÃO DE TANQUES ESTACIONÁRIOS ===</strong><br><br>
        <strong>Serial:</strong> Número de série do tanque estacionário<br>
        <strong>Capacidade:</strong> capacidade em quilos<br>
      `;
        break;

      default:
        break;
    }

    this.dialogService.openInfoDialog(message, title);
  }

  import() {
    this.loadingDialogRef = this.dialogService.openLoadingDialog();
    this.stationaryTankService.createMultiple(this.csv).subscribe(
      response => {
        if (response.statusCode == 200) {

          if (response.data.length === 0) {
            this.toastr.warning('No se importaron Tanques estacionarios', response.message);
            this.loadingDialogRef.close(); 
            return;
          }

          if (response.data.length < this.csv.length) {
            this.toastr.warning(`${response.message} ${response.data.length} Tanques estacionarios importados de ${this.csv.length}`, 'Información', {
              timeOut: 10000,
              progressBar: true,
              progressAnimation: 'increasing',
              closeButton: false,
              enableHtml: true
            });
            this.toStationaryTanks();
            this.loadingDialogRef.close(); 
            return;
          }

          this.toastr.success(`${response.message} ${response.data.length} Tanques estacionarios importados de ${this.csv.length}`, 'Información', {
            timeOut: 10000,
            progressBar: true,
            progressAnimation: 'increasing',
            closeButton: false,
            enableHtml: true
          });
          this.toStationaryTanks();
          this.loadingDialogRef.close(); 
        } else {
          this.toastr.warning('Verifique los campos ingresados', response.message);
          this.loadingDialogRef.close(); 
        }
      }, (error) => {
        console.error(error);
      });
  }

  toStationaryTanks() {
    this.router.navigate(['/poseidon/stationary-tank/list']);
  }
}
