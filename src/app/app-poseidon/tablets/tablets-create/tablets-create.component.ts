import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TabletService } from 'src/app/services/poseidon-services/tablet.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateUserComponent } from '../../usuarios/dialog-create-user/dialog-create-user.component';

@Component({
  selector: 'app-tablets-create',
  templateUrl: './tablets-create.component.html',
  styleUrls: ['./tablets-create.component.scss']
})
export class TabletsCreateComponent {
  private languageSubscription!: Subscription;

  tabletForm: FormGroup;
  operators: any[] = [];
  selectedOperator: any[] = [];
  operatorInput = false;

  constructor(
    private formBuilder: FormBuilder,
    private tabletService: TabletService,
    private toastr: ToastrService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TabletsCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toTablets();
        toastr.warning('No tienes permisos para crear');
      }
    });
    
    this.tabletForm = this.formBuilder.group({
      mac: [null, Validators.required],
      operator: [null, Validators.required],
      latitude: [''],
      longitude: [''],
      batteryPercent: [100],
    });
  }

  ngOnInit(): void {
    this.fetchOperators();
  }

  toggleInputOperator() {
    this.operatorInput = !this.operatorInput;
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
    const index = this.selectedOperator.indexOf(operator);
    if (index === -1) {
      const item = operator
      this.selectedOperator.push(item);
    } else {
      this.selectedOperator.splice(index, 1);
    }

    // Actualizar el valor del campo 'locations' en el formulario
    this.tabletForm.patchValue({ operator: this.selectedOperator });

    // Marcar el formulario como válido si se han seleccionado locations
    if (this.selectedOperator.length > 0) {
      this.tabletForm.get('operator')?.setValidators(Validators.required);
      this.tabletForm.get('operator')?.updateValueAndValidity();
    } else {
      this.tabletForm.get('operator')?.clearValidators();
      this.tabletForm.get('operator')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    console.log(this.tabletForm.value);
    if (this.tabletForm.valid) {
      this.tabletService.create(this.tabletForm.value).subscribe(
        response => {          
          if (response.statusCode == 200) {
            this.toastr.success(`La Tablet de placas ${response.data.plate} ha sido creado satisfactoriamente`, 'Éxito!');
            this.dialogRef.close();
          } else {
            this.toastr.warning('Ha ocurrido un problema al crear la Tablet', 'Advertencia!');
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un error al crear la Tablet ${error}`, 'Error!');
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

  toTablets() {
    this.router.navigate(['/poseidon/tablets/list']);
  }

}
