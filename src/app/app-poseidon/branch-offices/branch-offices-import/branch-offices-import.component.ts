import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { GeocodingService } from 'src/app/services/geo-coding.service';
import { DialogService } from 'src/app/services/dialog.service';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { LoadingDialogComponent } from 'src/app/dialog/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-branch-offices-import',
  templateUrl: './branch-offices-import.component.html',
  styleUrls: ['./branch-offices-import.component.scss']
})
export class BranchOfficesImportComponent {
  private languageSubscription!: Subscription;
  private loadingDialogRef!: MatDialogRef<LoadingDialogComponent>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  pageSizeOptions: number[] = [100, 500, 1000, 2500]; // Opciones de tamaño de página
  pageSize: number = 100; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  csv: any[] = [];
  collapsed = true;
  private menuSub!: Subscription;

  constructor(
    private branchOfficeService: BranchOfficesService,
    private toastr: ToastrService,
    private geocodingService: GeocodingService,
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
        this.toBranchOffices();
        toastr.warning('No tienes permisos para crear');
      }
    });
  }

  ngOnInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
         this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
          this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
        });
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
        let [city, zone, client, name, kilogramValue, stationary_tanks, nit, address, phone, email, latLong] = splitCsvLine(line);
        const processedData: any = {};
        processedData.city = city.replace(/"/g, '').trim();
        processedData.zone = zone.replace(/"/g, '').trim();
        processedData.client = client.replace(/"/g, '').trim();
        processedData.name = name.replace(/"/g, '').trim();
        processedData.kilogramValue = kilogramValue.replace(/"/g, '').trim();
        if (stationary_tanks) {
          let tanks: string | string[] = stationary_tanks.replace(/"/g, '').trim();
          processedData.stationary_tanks = tanks ? tanks.split(',') : [];
        } else {
          processedData.stationary_tanks = [];
        }
        processedData.nit = nit.replace(/"/g, '').trim();
        processedData.address = address.replace(/"/g, '').trim();
        processedData.phone = phone.replace(/"/g, '').trim();
        processedData.email = email.replace(/"/g, '').trim();
        if (latLong) {
          let latLongProcessed = latLong.replace(/"/g, '').trim();
          let latitude, longitude;

          // Check if latLong is a Plus Code
          if (/^[0-9A-Z]{4,}(\+[0-9A-Z]{2,})?$/.test(latLongProcessed)) {
            // Convert Plus Code to coordinates
            return this.geocodingService.getCoordinatesFromPlusCode(latLongProcessed).pipe(
              map(response => {
                latitude = response.results[0].geometry.location.lat;
                longitude = response.results[0].geometry.location.lng;
                return { ...processedData, latitude, longitude };
              })
            );
          } else {
            // Split into latitude and longitude
            [latitude, longitude] = latLongProcessed.split(',');
            processedData.latitude = latitude;
            processedData.longitude = longitude;
          }
        }

        return of(processedData);
      });

    forkJoin(jsonObjects).subscribe({
      next: jsonObjects => {
        this.csv = jsonObjects;
        console.log(this.csv);
      },
      error: err => {
        console.error(err.message);
        this.toastr.error(err.message, 'Error de Formato');
      }
    });
  }

  generateTemplate() {
    // Define workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let ws_data: any[] = [];

    // Define worksheet data
    switch (this.languageService.getLanguage()) {
      case 'es':
        ws_data = [
          [
            'Ciudad',
            'Zona',
            'Cliente (identificación)',
            'Establecimiento',
            'Valor por Kilo',
            'Tanques Estacionarios (separe con comas)',
            'Nit',
            'Dirección',
            'Telefono',
            'Email',
            'Ubicación',
          ]
        ];
        break;

      case 'en':
        ws_data = [
          [
            'City',
            'Zone',
            'Client (identification)',
            'Branch Office',
            'Value per Kilo',
            'Stationary Tanks (separate with commas)',
            'Nit',
            'Address',
            'Phone',
            'Email',
            'Location',
          ]
        ];
        break;

      case 'pt':
        ws_data = [
          [
            'Cidade',
            'Zona',
            'Cliente (identificação)',
            'Estabelecimento',
            'Valor por Quilo',
            'Tanques Estacionários (separe com vírgulas)',
            'Nit',
            'Endereço',
            'Telefone',
            'Email',
            'Localização',
          ]
        ];
        break;

      default:
        break;
    }

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write workbook to file
    XLSX.writeFile(wb, 'branch-offices-format.xls');
  }

  import() {
    this.loadingDialogRef = this.dialogService.openLoadingDialog();
    this.branchOfficeService.createMultiple(this.csv).subscribe(
      response => {
        if (response.statusCode == 200) {

          if (response.data.length === 0) {
            this.toastr.warning('No se importaron establecimientos', response.message);
            this.loadingDialogRef.close(); 
            return;
          }

          if (response.data.length < this.csv.length) {
            this.toastr.warning(`${response.message} ${response.data.length} Establecimientos importados de ${this.csv.length}`, 'Información', {
              timeOut: 10000,
              progressBar: true,
              progressAnimation: 'increasing',
              closeButton: false,
              enableHtml: true
            });
            this.toBranchOffices();
            this.loadingDialogRef.close(); 
            return;
          }

          this.toastr.success(`${response.message} ${response.data.length} Establecimientos importados de ${this.csv.length}`, 'Información', {
            timeOut: 10000,
            progressBar: true,
            progressAnimation: 'increasing',
            closeButton: false,
            enableHtml: true
          });
          this.toBranchOffices();
          this.loadingDialogRef.close(); 
        } else {
          this.toastr.warning('Verifique los campos ingresados', response.message);
          this.loadingDialogRef.close(); 
        }
      }, (error) => {
        console.error(error);
        this.loadingDialogRef.close(); 
      });
  }

  infoImport() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {

      case 'es':
        title = 'Información de Importación';

        message = `
        <strong>=== IMPORTACIÓN DE ESTABLECIMIENTOS ===</strong><br><br>
        <strong>Ciudad:</strong> Ciudad del establecimiento (obtenga este dato de la lista de ciudades)<br>
        <strong>Zona:</strong> Zona del establecimiento (obtenga este dato de la lista de zonas)<br>
        <strong>Cliente (identificación):</strong> Identificación del cliente (obtenga este dato de la lista de clientes)<br>
        <strong>Establecimiento:</strong> Nombre del establecimiento<br>
        <strong>Valor por Kilo:</strong> Valor por kilo de gas<br>
        <strong>Tanques Estacionarios:</strong> Seriales (obtenga este dato de la lista de tanques estacionarios)<br>
        <strong>Nit:</strong> NIT del establecimiento<br>
        <strong>Dirección:</strong> Dirección del establecimiento<br>
        <strong>Telefono:</strong> Teléfono del establecimiento<br>
        <strong>Email:</strong> Correo electrónico del establecimiento<br>
        <strong>Ubicación:</strong> Este campo acepta plusCode o latitud, longitud<br>
      `;
        break;

      case 'en':
        title = 'Import Information';

        message = `
        <strong>=== BRANCH OFFICES IMPORT ===</strong><br><br>
        <strong>City:</strong> Branch office city (get this data from the cities list)<br>
        <strong>Zone:</strong> Branch office zone (get this data from the zones list)<br>
        <strong>Client (identification):</strong> Client identification (get this data from the clients list)<br>
        <strong>Branch Office:</strong> Branch office name<br>
        <strong>Value per Kilo:</strong> Value per kilo of gas<br>
        <strong>Stationary Tanks:</strong> Serials (get this data from the stationary tanks list)<br>
        <strong>Nit:</strong> Branch office NIT<br>
        <strong>Address:</strong> Branch office address<br>
        <strong>Phone:</strong> Branch office phone<br>
        <strong>Email:</strong> Branch office email<br>
        <strong>Location:</strong> This field accepts plusCode or latitude, longitude<br>
      `;
        break;

      case 'pt':
        title = 'Informações de Importação';
        message = `
        <strong>=== IMPORTAÇÃO DE ESTABELECIMENTOS ===</strong><br><br>
        <strong>Cidade:</strong> Cidade do estabelecimento (obtenha esses dados da lista de cidades)<br>
        <strong>Zona:</strong> Zona do estabelecimento (obtenha esses dados da lista de zonas)<br>
        <strong>Cliente (identificação):</strong> Identificação do cliente (obtenha esses dados da lista de clientes)<br>
        <strong>Estabelecimento:</strong> Nome do estabelecimento<br>
        <strong>Valor por Quilo:</strong> Valor por quilo de gás<br>
        <strong>Tanques Estacionários:</strong> Seriais (obtenha esses dados da lista de tanques estacionários)<br>
        <strong>Nit:</strong> NIT do estabelecimento<br>
        <strong>Endereço:</strong> Endereço do estabelecimento<br>
        <strong>Telefone:</strong> Telefone do estabelecimento<br>
        <strong>Email:</strong> Email do estabelecimento<br>
        <strong>Localização:</strong> Este campo aceita plusCode ou latitude, longitude<br>
      `;
        break;

      default:
        break;
    }

    this.dialogService.openInfoDialog(message, title);
  }

  confirmDownloadTemplate() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {
      case 'es':
        title = 'Información de Importación, ¿Desea descargar el formato?';

        message = `
        <strong>=== IMPORTACIÓN DE ESTABLECIMIENTOS ===</strong><br><br>
        <strong>Ciudad:</strong> Ciudad del establecimiento (obtenga este dato de la lista de ciudades)<br>
        <strong>Zona:</strong> Zona del establecimiento (obtenga este dato de la lista de zonas)<br>
        <strong>Cliente (identificación):</strong> Identificación del cliente (obtenga este dato de la lista de clientes)<br>
        <strong>Establecimiento:</strong> Nombre del establecimiento<br>
        <strong>Valor por Kilo:</strong> Valor por kilo de gas<br>
        <strong>Tanques Estacionarios:</strong> Seriales (obtenga este dato de la lista de tanques estacionarios)<br>
        <strong>Nit:</strong> NIT del establecimiento<br>
        <strong>Dirección:</strong> Dirección del establecimiento<br>
        <strong>Telefono:</strong> Teléfono del establecimiento<br>
        <strong>Email:</strong> Correo electrónico del establecimiento<br>
        <strong>Ubicación:</strong> Este campo acepta plusCode o latitud, longitud<br>
      `;
        break;

      case 'en':
        title = 'Import Information, Do you want to download the template?';

        message = `
        <strong>=== BRANCH OFFICES IMPORT ===</strong><br><br>
        <strong>City:</strong> Branch office city (get this data from the cities list)<br>
        <strong>Zone:</strong> Branch office zone (get this data from the zones list)<br>
        <strong>Client (identification):</strong> Client identification (get this data from the clients list)<br>
        <strong>Branch Office:</strong> Branch office name<br>
        <strong>Value per Kilo:</strong> Value per kilo of gas<br>
        <strong>Stationary Tanks:</strong> Serials (get this data from the stationary tanks list)<br>
        <strong>Nit:</strong> Branch office NIT<br>
        <strong>Address:</strong> Branch office address<br>
        <strong>Phone:</strong> Branch office phone<br>
        <strong>Email:</strong> Branch office email<br>
        <strong>Location:</strong> This field accepts plusCode or latitude, longitude<br>
      `;
        break;

      case 'pt':
        title = 'Informações de Importação, Deseja baixar o modelo?';

        message = `
        <strong>=== IMPORTAÇÃO DE ESTABELECIMENTOS ===</strong><br><br>
        <strong>Cidade:</strong> Cidade do estabelecimento (obtenha esses dados da lista de cidades)<br>
        <strong>Zona:</strong> Zona do estabelecimento (obtenha esses dados da lista de zonas)<br>
        <strong>Cliente (identificação):</strong> Identificação do cliente (obtenha esses dados da lista de clientes)<br>
        <strong>Estabelecimento:</strong> Nome do estabelecimento<br>
        <strong>Valor por Quilo:</strong> Valor por quilo de gás<br>
        <strong>Tanques Estacionários:</strong> Seriais (obtenha esses dados da lista de tanques estacionários)<br>
        <strong>Nit:</strong> NIT do estabelecimento<br>
        <strong>Endereço:</strong> Endereço do estabelecimento<br>
        <strong>Telefone:</strong> Telefone do estabelecimento<br>
        <strong>Email:</strong> Email do estabelecimento<br>
        <strong>Localização:</strong> Este campo aceita plusCode ou latitude, longitude<br>
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

  toBranchOffices() {
    this.router.navigate(['/poseidon/branch-offices/list']);
  }

  confirmDownloadConsolidateData() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {
      case 'es':
        title = 'Información de Exportación, ¿Desea descargar el archivo?';

        message = `
        <strong>=== EXPORTACIÓN DE ESTABLECIMIENTOS ===</strong>
        <br><br>
        <p> Se exportará un archivo con la siguiente total de los establecimientos existentes</p> <br>
        <p> ¿Desea descargar el archivo?</p> <br>
        `;
        break;

      case 'en':
        title = 'Export Information, Do you want to download the file?';

        message = `
        <strong>=== BRANCH OFFICES EXPORT ===</strong>
        <br><br>
        <p> A file with the total of existing branch offices will be exported</p> <br>
        <p> Do you want to download the file?</p> <br>
        `;
        break;

      case 'pt':
        title = 'Informações de Exportação, Deseja baixar o arquivo?';

        message = `
        <strong>=== EXPORTAÇÃO DE ESTABELECIMENTOS ===</strong>
        <br><br>
        <p> Será exportado um arquivo com o total dos estabelecimentos existentes</p> <br>
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
    this.branchOfficeService.getAlls().subscribe(
      response => {
        if (response.statusCode === 200) {
          const branch_offices = response.data;

          // Define workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          let ws_data: any[] = [];

          // Define worksheet data
          switch (this.languageService.getLanguage()) {
            case 'es':
              ws_data = [
                ['Ciudad',
                  'Zona',
                  'Cliente (identificación)',
                  'Establecimiento',
                  'Valor por Kilo',
                  'Tanques Estacionarios (separe con comas)',
                  'Nit',
                  'Dirección',
                  'Telefono',
                  'Email',
                  'Ubicación',
                ]
              ];
              break;

            case 'en':
              ws_data = [
                ['City',
                  'Zone',
                  'Client (identification)',
                  'Branch Office',
                  'Value per Kilo',
                  'Stationary Tanks (separate with commas)',
                  'Nit',
                  'Address',
                  'Phone',
                  'Email',
                  'Location',
                ]
              ];
              break;

            case 'pt':
              ws_data = [
                ['Cidade',
                  'Zona',
                  'Cliente (identificação)',
                  'Estabelecimento',
                  'Valor por Quilo',
                  'Tanques Estacionários (separe com vírgulas)',
                  'Nit',
                  'Endereço',
                  'Telefone',
                  'Email',
                  'Localização',
                ]
              ];
              break;

            default:
              break;
          }

          // Add rows for each branch office
          for (let branch_office of branch_offices) {
            ws_data.push([
              branch_office.city[0].name, // Assuming city is an array and you want the name of the first city
              branch_office.zone[0].name, // Assuming zone is an array and you want the name of the first zone
              branch_office.client[0].cc, // Assuming client is an array and you want the identification of the first client
              branch_office.name,
              branch_office.kilogramValue,
              branch_office.stationary_tanks.map((tank: { serial: string }) => tank.serial).join(','),
              branch_office.nit,
              branch_office.address,
              branch_office.phone,
              branch_office.email,
              branch_office.latitude + ',' + branch_office.longitude,
            ]);
          }

          // Create worksheet
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Write workbook to file
          XLSX.writeFile(wb, 'consolidate_branch-offices.xls');
        }
      }, (error) => {
        console.error(error);
      });
  }

}

function splitCsvLine(line: string): string[] {
  const fields = [];
  let start = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === ',' && !inQuotes) {
      fields.push(line.substring(start, i));
      start = i + 1;
    }
  }
  fields.push(line.substring(start));
  return fields;
}