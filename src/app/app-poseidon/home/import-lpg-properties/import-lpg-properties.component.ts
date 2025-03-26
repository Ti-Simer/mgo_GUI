import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LpgPropertiesService } from 'src/app/services/poseidon-services/lpg-properties.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { DialogService } from 'src/app/services/dialog.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-import-lpg-properties',
  templateUrl: './import-lpg-properties.component.html',
  styleUrls: ['./import-lpg-properties.component.scss']
})
export class ImportLpgPropertiesComponent implements OnInit {

  lpgProperties: any[] = [];
  lpgPropertiesForm: FormGroup;

  example = [
    {
      "compound": "Etano",
      "volume_percent": 1.81,
      "pie3_gal": 37.476,
      "volatility_factor": 3.6,
      "molar_mass": 30.07,
      "critical_temperature": 89.92,
      "critical_pressure": 706.5,
      "acentric_factor": 0.0979
    },
    {
      "compound": "Propano",
      "volume_percent": 53.48,
      "pie3_gal": 36.375,
      "volatility_factor": 1,
      "molar_mass": 44.097,
      "critical_temperature": 206.06,
      "critical_pressure": 616,
      "acentric_factor": 0.1522
    },
    {
      "compound": "Isobutano",
      "volume_percent": 19.69,
      "pie3_gal": 30.639,
      "volatility_factor": 0.43,
      "molar_mass": 58.123,
      "critical_temperature": 274.46,
      "critical_pressure": 527.9,
      "acentric_factor": 0.1852
    },
    {
      "compound": "n-butano",
      "volume_percent": 24.96,
      "pie3_gal": 31.79,
      "volatility_factor": 0.3,
      "molar_mass": 58.123,
      "critical_temperature": 305.62,
      "critical_pressure": 550.6,
      "acentric_factor": 0.1995
    },
    {
      "compound": "n-pentano",
      "volume_percent": 0.06,
      "pie3_gal": 27.674,
      "volatility_factor": 0.09,
      "molar_mass": 72.15,
      "critical_temperature": 385.8,
      "critical_pressure": 488.6,
      "acentric_factor": 0.2514
    },
    {
      "compound": "Etileno",
      "volume_percent": 0,
      "pie3_gal": 0,
      "volatility_factor": 3.6,
      "molar_mass": 28.054,
      "critical_temperature": 48.54,
      "critical_pressure": 731,
      "acentric_factor": 0.0865
    },
    {
      "compound": "Propileno",
      "volume_percent": 0,
      "pie3_gal": 39.167,
      "volatility_factor": 1,
      "molar_mass": 42.081,
      "critical_temperature": 197.17,
      "critical_pressure": 668.6,
      "acentric_factor": 0.1356
    },
    {
      "compound": "1-buteno",
      "volume_percent": 0,
      "pie3_gal": 33.894,
      "volatility_factor": 0.3,
      "molar_mass": 56.108,
      "critical_temperature": 295.48,
      "critical_pressure": 583.5,
      "acentric_factor": 0.1941
    },
    {
      "compound": "Cis-2-buteno",
      "volume_percent": 0,
      "pie3_gal": 35.366,
      "volatility_factor": 0.3,
      "molar_mass": 56.108,
      "critical_temperature": 324.37,
      "critical_pressure": 612.1,
      "acentric_factor": 0.2029
    },
    {
      "compound": "Trans-2-buteno",
      "volume_percent": 0,
      "pie3_gal": 34.395,
      "volatility_factor": 0.3,
      "molar_mass": 56.108,
      "critical_temperature": 311.86,
      "critical_pressure": 587.4,
      "acentric_factor": 0.2128
    },
    {
      "compound": "Isobuteno",
      "volume_percent": 0,
      "pie3_gal": 33.856,
      "volatility_factor": 0.43,
      "molar_mass": 56.108,
      "critical_temperature": 292.55,
      "critical_pressure": 580.2,
      "acentric_factor": 0.1999
    },
    {
      "compound": "1,3-butadieno",
      "volume_percent": 0,
      "pie3_gal": 36.687,
      "volatility_factor": 0.3,
      "molar_mass": 54.092,
      "critical_temperature": 305,
      "critical_pressure": 627.5,
      "acentric_factor": 0.2007
    }
  ]

  constructor(
    public dialogRef: MatDialogRef<ImportLpgPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lpgPropertiesService: LpgPropertiesService,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private languageService: LanguageService,
    private authService: AuthService,
  ) {
    this.lpgPropertiesForm = this.formBuilder.group({
      xls: [null, Validators.required],
      type_GLP: [null, Validators.required],
    });
  }


  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.fetchLpgProperties();
  }

  fetchLpgProperties() {
    this.lpgPropertiesService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.lpgProperties = response.data;
        } else {
          this.toastr.info(response.message);
        }
      }
    );
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.lpgProperties.sort((a: any, b: any) => {
      let valueA = a;
      let valueB = b;

      // Navega a través de las claves para obtener el valor final
      keys.forEach(key => {
        if (key.includes('[')) {
          const [arrayKey, index] = key.split(/[\[\]]/).filter(Boolean);
          valueA = valueA[arrayKey][index];
          valueB = valueB[arrayKey][index];
        } else {
          valueA = valueA[key];
          valueB = valueB[key];
        }
      });

      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0; // Los valores son iguales
    });
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
        const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ';', RS: '\n' });

        // Reemplaza los puntos decimales por comas en los porcentajes
        const formattedCsv = csv.replace(/(\d+),(\d+)%/g, '$1.$2%');
        this.lpgPropertiesForm.patchValue({ xls: formattedCsv });
      };
      reader.readAsArrayBuffer(file);
    }
  }

  downloadProperties() {
    // Define workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let ws_data: any[] = [];

    ws_data = [
      [`GLP_${this.lpgProperties[0].type_GLP}`],
      [
        'compound',
        'volume_percent',
        'pie3_gal',
        'volatility_factor',
        'relative_volatility',
        'vapor_fraction',
        'molar_mass',
        'steam_weight',
        'critical_temperature',
        'critical_pressure',
        'acentric_factor',
        'temp_vapor',
        'pres_vapor',
        'factor_vapor',
      ]
    ];

    // Add rows for each branch office
    for (let item of this.lpgProperties) {
      ws_data.push([
        item.compound,
        item.volume_percent,
        item.pie3_gal,
        item.volatility_factor,
        item.relative_volatility,
        item.vapor_fraction,
        item.molar_mass,
        item.steam_weight,
        item.critical_temperature,
        item.critical_pressure,
        item.acentric_factor,
        item.temp_vapor,
        item.pres_vapor,
        item.factor_vapor,
      ]);
    }

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write workbook to file
    XLSX.writeFile(wb, `${this.lpgProperties[0].type_GLP}.xls`);
  }

  clearTable() {
    this.dialogService.openConfirmDialog('¿Esta seguro que desea eliminar la tabla de propiedades?, recuerde que esta información sera borrada definitivamente')
      .subscribe(result => {
        if (result) {
          this.lpgPropertiesService.clearTable().subscribe(
            response => {
              if (response.statusCode == 200) {
                this.toastr.success(response.message);
                this.dialogRef.close();
              } else {
                this.toastr.warning(response.message);
              }
            });
        }
      });
  }

  downloadFormat() {
    // Define workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let ws_data: any[] = [];

    ws_data = [
      [
        'compound',
        'volume_percent',
        'pie3_gal',
        'volatility_factor',
        'molar_mass',
        'critical_temperature',
        'critical_pressure',
        'acentric_factor',
      ]
    ];

    for (let item of this.example) {
      ws_data.push([
        item.compound,
        item.volume_percent,
        item.pie3_gal,
        item.volatility_factor,
        item.molar_mass,
        item.critical_temperature,
        item.critical_pressure,
        item.acentric_factor,
      ]);
    }

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write workbook to file
    XLSX.writeFile(wb, `propertiesGLP_format.xls`);
  }

  helpTypeGlp() {
    let message = '';
    let title = '';

    switch (this.languageService.getLanguage()) {

      case 'es':
        title = 'Información';

        message = `
        === TIPOS DE GLP ===<br><br>
        Aquí se debe ingresar el nombre del tipo de GLP que se está importando. Por ejemplo, puedes usar alguno de los siguientes: Cusiana, Dina, Apiay, Cupiagua, Floreña, Capachos, Corcel, etc.
        `;
        break;

      case 'en':
        title = 'Information';

        message = `
        === LPG TYPES ===<br><br>
        Here you must enter the name of the LPG type you are importing. For example, you can use any of the following: Cusiana, Dina, Apiay, Cupiagua, Floreña, Capachos, Corcel, etc.
        `;
        break;

      case 'pt':
        title = 'Informação';
        message = `
        === TIPOS DE GLP ===<br><br>
        Aqui você deve inserir o nome do tipo de GLP que está importando. Por exemplo, você pode usar qualquer um dos seguintes: Cusiana, Dina, Apiay, Cupiagua, Floreña, Capachos, Corcel, etc.
      `;
        break;

      default:
        break;
    }

    this.dialogService.openInfoDialog(message, title);
  }



  onSubmit() {
    this.lpgPropertiesService.create(this.lpgPropertiesForm.value).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.toastr.success(response.message);
        }
        else {
          this.toastr.warning(response.message);
        }
        this.dialogRef.close();
      }
    );
  }
}
