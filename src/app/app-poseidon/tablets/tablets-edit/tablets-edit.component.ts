import { Component,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-tablets-edit',
  templateUrl: './tablets-edit.component.html',
  styleUrls: ['./tablets-edit.component.scss']
})
export class TabletsEditComponent {
  private languageSubscription!: Subscription;
  @Input() tabletId: any;

  updateForm: FormGroup;

  tablet: any;
  operators: any[] = [];
  selectedOperator: any[] = [];
  operatorInput = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private router: Router,
    private tabletService: TabletService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TabletsEditComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.updateForm = this.formBuilder.group({
      mac: [null, Validators.required],
      operator: [null, Validators.required]
    });
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toTablets();
        toastr.warning('No tienes permisos para editar');
      }
    });
  }

  ngOnInit(): void {
    this.getTablet();
  }

  toggleInputOperator() {
    this.operatorInput = !this.operatorInput;
  }

  getTablet() {
    this.tabletService.getById(this.tabletId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.tablet = response.data;
          this.fetchOperators();

          this.updateForm.patchValue({
            mac: this.tablet.mac,
            operator: this.tablet.operator[0].id,
          });

          console.log(this.updateForm.value);
          

        } else {
          this.toastr.warning(`Ha ocurrido un problema al consultar el Auto Tanque`, response.message);
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar el Auto Tanque ${error}`);
      }
    );
  }

  fetchOperators() {
    this.usuarioService.listOperators().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.operators = response.data;
        } else {
          this.toastr.warning('Ha ocurrido un problema al consultar los opearios', response.message);
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar los operarios ${error}`);
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
    this.updateForm.patchValue({ operator: this.selectedOperator });

    // Marcar el formulario como válido si se han seleccionado locations
    if (this.selectedOperator.length > 0) {
      this.updateForm.get('operator')?.setValidators(Validators.required);
      this.updateForm.get('operator')?.updateValueAndValidity();
    } else {
      this.updateForm.get('operator')?.clearValidators();
      this.updateForm.get('operator')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.updateForm.valid) {
      this.tabletService.update(this.tabletId, this.updateForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`la Tablet ${response.data.plate} ha sido actualizado satisfactoriamente`, 'Exito!')
            this.dialogRef.close();
          } else {
            this.toastr.warning('Ha ocurrido un problema al editar la Tablet', response.message);
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un problema al editar la Tablet ${error}`);
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
