import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ClientService } from 'src/app/services/poseidon-services/client.service';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { LoadingDialogComponent } from 'src/app/dialog/loading-dialog/loading-dialog.component';
import {
  LucideAngularModule,
  SquareUserRound,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Sheet,
  PlusCircle,
  FileDown,
  HelpCircle,
  Search,
  LucideUploadCloud
} from 'lucide-angular';

@Component({
  selector: 'app-clients-import',
  templateUrl: './clients-import.component.html',
  styleUrls: ['./clients-import.component.scss']
})
export class ClientsImportComponent {
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
    private clientService: ClientService,
    private toastr: ToastrService,
    private router: Router,
    private dialogService: DialogService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toClients();
        toastr.warning('No tienes permisos para crear');
      }
    });

    LucideAngularModule.pick({
      SquareUserRound,
      ArrowBigLeftDash,
      ArrowBigRightDash,
      Sheet,
      PlusCircle,
      FileDown,
      HelpCircle,
      Search,
      LucideUploadCloud
    })
  }

  ngOnInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
          this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
        });

        if (this.paginator) {
          this.paginator.page.subscribe((event: any) => {
            // Actualizar los datos de la tabla según la página seleccionada
          });
        }
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
        let [firstName, lastName, phone, email, cc, occupation] = line.split(',');
        firstName = firstName.replace(/"/g, '').trim();  // remove double quotes and trim
        lastName = lastName.replace(/"/g, '').trim();
        phone = phone.replace(/"/g, '').trim();
        email = email.replace(/"/g, '').trim();
        cc = cc.replace(/"/g, '').trim();
        occupation = occupation.replace(/"/g, '').trim();
        return { firstName, lastName, phone, email, cc, occupation };
      });
    this.csv = jsonObjects;
    console.log(this.csv);
  }

  confirmDownloadTemplate() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {
      case 'es':
        title = 'Información de Importación, ¿Desea descargar el formato?';
        message = `
        <strong>=== IMPORTACIÓN DE CLIENTES ===</strong><br><br>
        <strong>Nombre:</strong> Nombre del cliente<br>
        <strong>Apellido:</strong> Apellido del cliente<br>
        <strong>Teléfono (identificación):</strong> Contacto telefónico<br>
        <strong>E-mail (identificación):</strong> Contacto por correo electrónico<br>
        <strong>N° de identificación:</strong> Cédula o identificador del cliente <br>
        <strong>Cargo:</strong> Cargo o ocupación del cliente (obtenga este dato de la lista de cargos)<br>
      `;
        break;

      case 'en':
        title = 'Import Information, Do you want to download the format?';
        message = `
        <strong>=== CLIENTS IMPORT ===</strong><br><br>
        <strong>Name:</strong> Client's name<br>
        <strong>Last Name:</strong> Client's last name<br>
        <strong>Phone (identification):</strong> Phone contact<br>
        <strong>E-mail (identification):</strong> Email contact<br>
        <strong>Identification number:</strong> Client's ID or identifier <br>
        <strong>Occupation:</strong> Client's job or occupation (get this data from the list of jobs)<br>
      `;
        break;

      case 'pt':
        title = 'Informações de Importação, Deseja baixar o formato?';
        message = `
        <strong>=== IMPORTAÇÃO DE CLIENTES ===</strong><br><br>
        <strong>Nome:</strong> Nome do cliente<br>
        <strong>Sobrenome:</strong> Sobrenome do cliente<br>
        <strong>Telefone (identificação):</strong> Contato telefônico<br>
        <strong>E-mail (identificação):</strong> Contato por e-mail<br>
        <strong>Número de identificação:</strong> Cédula ou identificador do cliente <br>
        <strong>Cargo:</strong> Cargo ou ocupação do cliente (obtenha esses dados da lista de cargos)<br>
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

    let ws_data: any[] = [];

    // Define worksheet data
    switch (this.languageService.getLanguage()) {
      case 'es':
        ws_data = [
          ['Nombre', 'Apellido', 'Telefono', 'E-mail', 'N° de Identificación', 'Cargo']
        ];
        break;

      case 'en':
        ws_data = [
          ['Name', 'Last Name', 'Phone', 'E-mail', 'Identification Number', 'Occupation']
        ];
        break;

      case 'pt':
        ws_data = [
          ['Nome', 'Sobrenome', 'Telefone', 'E-mail', 'N° de Identificação', 'Cargo']
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
    XLSX.writeFile(wb, 'clients-format.xls');
  }

  confirmDownloadConsolidateData() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {
      case 'es':
        title = 'Información de Exportación, ¿Desea descargar el archivo?';
        message = `
        <strong>=== EXPORTACIÓN DE CLIENTES ===</strong>
        <br><br>
        <p> Se exportará un archivo con la siguiente total de los clientes existentes</p> <br>
        <p> ¿Desea descargar el archivo?</p> <br>
      `;
        break;

      case 'en':
        title = 'Export Information, Do you want to download the file?';
        message = `
        <strong>=== CLIENTS EXPORT ===</strong>
        <br><br>
        <p> A file with the following total of existing clients will be exported</p> <br>
        <p> Do you want to download the file?</p> <br>
      `;
        break;

      case 'pt':
        title = 'Informações de Exportação, Deseja baixar o arquivo?';
        message = `
        <strong>=== EXPORTAÇÃO DE CLIENTES ===</strong>
        <br><br>
        <p> Será exportado um arquivo com o seguinte total de clientes existentes</p> <br>
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
    this.clientService.getAll().subscribe(
      response => {
        if (response.statusCode === 200) {
          const clients = response.data;
          console.log(clients);

          // Define workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          let ws_data: any[] = [];

          // Define worksheet data
          switch (this.languageService.getLanguage()) {
            case 'es':
              ws_data = [
                [
                  'Nombre',
                  'Apellido',
                  'Teléfono',
                  'E-mail',
                  'N° de Identificación',
                  'Cargo',
                ]
              ];
              break;

            case 'en':
              ws_data = [
                [
                  'Name',
                  'Last Name',
                  'Phone',
                  'E-mail',
                  'Identification Number',
                  'Occupation',
                ]
              ];
              break;

            case 'pt':
              ws_data = [
                [
                  'Nome',
                  'Sobrenome',
                  'Telefone',
                  'E-mail',
                  'N° de Identificação',
                  'Cargo',
                ]
              ];
              break;

            default:
              break;
          }

          // Add rows for each branch office
          for (let client of clients) {
            ws_data.push([
              client.firstName,
              client.lastName,
              client.phone,
              client.email,
              client.cc,
              client.occupation[0].name
            ]);
          }

          // Create worksheet
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Write workbook to file
          XLSX.writeFile(wb, 'consolidate-clients.xls');
        }
      }, (error) => {
        console.error(error);
      });
  }

  infoImport() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {
      case 'es':
        title = 'Información de Importación';
        message = `
        <strong>=== IMPORTACIÓN DE CLIENTES ===</strong><br><br>
        <strong>Nombre:</strong> Nombre del cliente<br>
        <strong>Apellido:</strong> Apellido del cliente<br>
        <strong>Teléfono (identificación):</strong> Contacto telefónico<br>
        <strong>E-mail (identificación):</strong> Contacto por correo electrónico<br>
        <strong>N° de identificación:</strong> Cédula o identificador del cliente <br>
        <strong>Cargo:</strong> Cargo o ocupación del cliente (obtenga este dato de la lista de cargos)<br>
      `;
        break;

      case 'en':
        title = 'Import Information';
        message = `
        <strong>=== CLIENTS IMPORT ===</strong><br><br>
        <strong>Name:</strong> Client's name<br>
        <strong>Last Name:</strong> Client's last name<br>
        <strong>Phone (identification):</strong> Phone contact<br>
        <strong>E-mail (identification):</strong> Email contact<br>
        <strong>Identification number:</strong> Client's ID or identifier <br>
        <strong>Occupation:</strong> Client's job or occupation (get this data from the list of jobs)<br>
      `;
        break;

      case 'pt':
        title = 'Informações de Importação';
        message = `
        <strong>=== IMPORTAÇÃO DE CLIENTES ===</strong><br><br>
        <strong>Nome:</strong> Nome do cliente<br>
        <strong>Sobrenome:</strong> Sobrenome do cliente<br>
        <strong>Telefone (identificação):</strong> Contato telefônico<br>
        <strong>E-mail (identificação):</strong> Contato por e-mail<br>
        <strong>Número de identificação:</strong> Cédula ou identificador do cliente <br>
        <strong>Cargo:</strong> Cargo ou ocupação do cliente (obtenha esses dados da lista de cargos)<br>
      `;
        break;

      default:
        break;
    }

    this.dialogService.openInfoDialog(message, title);
  }

  import() {
    this.loadingDialogRef = this.dialogService.openLoadingDialog();
    this.clientService.createMultiple(this.csv).subscribe(
      response => {
        if (response.statusCode == 200) {

          if (response.data.length === 0) {
            this.toastr.warning('No se importaron clientes', response.message);
            this.loadingDialogRef.close();
            return;
          }

          if (response.data.length < this.csv.length) {
            this.toastr.warning(`${response.message} ${response.data.length} Clientes importados de ${this.csv.length}`, 'Información', {
              timeOut: 10000,
              progressBar: true,
              progressAnimation: 'increasing',
              closeButton: false,
              enableHtml: true
            });
            this.toClients();
            this.loadingDialogRef.close();
            return;
          }

          this.toastr.success(`${response.message} ${response.data.length} Clientes importados de ${this.csv.length}`, 'Información', {
            timeOut: 10000,
            progressBar: true,
            progressAnimation: 'increasing',
            closeButton: false,
            enableHtml: true
          });
          this.toClients();
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

  toClients() {
    this.router.navigate(['/poseidon/client/list']);
  }
}
