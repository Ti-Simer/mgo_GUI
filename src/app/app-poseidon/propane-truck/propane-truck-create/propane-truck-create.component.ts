import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PropaneTruckService } from 'src/app/services/poseidon-services/propane-truck.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateUserComponent } from '../../usuarios/dialog-create-user/dialog-create-user.component';

@Component({
  selector: 'app-propane-truck-create',
  templateUrl: './propane-truck-create.component.html',
  styleUrls: ['./propane-truck-create.component.scss']
})
export class PropaneTruckCreateComponent {
  private languageSubscription!: Subscription;

  @ViewChild('plateInput') plateInput!: ElementRef;
  @ViewChild('myInput') searchInput!: ElementRef;

  propaneTruckForm: FormGroup;

  operatorInput = false;
  multipleSelection = false;
  operators: any[] = [];
  selectedOperator: any[] = [];

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private propaneTruckService: PropaneTruckService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PropaneTruckCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.propaneTruckForm = this.formBuilder.group({
      plate: ['', [Validators.required, Validators.maxLength(10), this.plateValidator]],
      capacity: [null, Validators.required],
      operator: [null, Validators.required],
      factor: [null, Validators.required],
    });

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toPropaneTrucks();
        toastr.warning('No tienes permisos para crear');
      }
    });
  }

  ngOnInit(): void {
    this.fetchOperators();
  }

  ngAfterViewInit() {
    this.initializeSearchFilter();
  }

  initializeSearchFilter() {
    if (this.searchInput) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#tableOperators tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  toggleInputOperator() {
    this.operatorInput = !this.operatorInput;
  }

  toggleMultipleSelection() {
    this.multipleSelection = !this.multipleSelection;
  }

  onPlateInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    this.propaneTruckForm.get('plate')?.setValue(input.value, { emitEvent: false });
  }

  plateValidator(control: any): { [key: string]: boolean } | null {
    const valid = /^[A-Z0-9-]{1,10}$/.test(control.value);
    return valid ? null : { invalidPlate: true };
  }

  fetchOperators() {
    this.usuarioService.listOperators().subscribe(
      response => {
        console.log(response);

        if (response.statusCode == 200) {
          this.operators = response.data;
        } else {
          this.toastr.info('No se han creado operadores', 'Por favor cree operadores!')
          this.router.navigate(['/usuarios/create']);
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar los operadores ${error}`);
      }
    );
  }

  onOperatorChange(operator: any) {
    const index = this.selectedOperator.indexOf(operator.id);

    if (index === -1) {
      // Si no se encuentra en la lista, agrégalo
      this.selectedOperator.push(operator.id);
    } else {
      // Si ya está en la lista, quítalo
      this.selectedOperator.splice(index, 1);
      if (this.selectedOperator.length === 0) {
        this.propaneTruckForm.patchValue({ operator: null });
      }
    }

    this.propaneTruckForm.patchValue({ operator: this.selectedOperator });

    if (this.selectedOperator.length > 0) {
      this.propaneTruckForm.get('operator')?.setValidators(Validators.required);
      this.propaneTruckForm.get('operator')?.updateValueAndValidity();
    } else {
      this.propaneTruckForm.get('operator')?.clearValidators();
      this.propaneTruckForm.get('operator')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.propaneTruckForm.valid) {
      this.propaneTruckForm.patchValue({
        factor: this.propaneTruckForm.value.factor / 100
      });

      this.propaneTruckService.create(this.propaneTruckForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`El Auto Tanque de placas ${response.data.plate} ha sido creado satisfactoriamente`, 'Éxito!');
            this.dialogRef.close();
          } else {
            this.toastr.warning('Ha ocurrido un problema al crear el Auto Tanque', 'Advertencia!');
            console.log(response.message);
            
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un error al crear el Auto Tanque ${error}`, 'Error!');
        }
      );
    }
  }

  toCreateOperators() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateUserComponent, {
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchOperators();
        });
      }
    });
  }

  toPropaneTrucks() {
    this.router.navigate(['/poseidon/propane-trucks/list']);
  }

}
