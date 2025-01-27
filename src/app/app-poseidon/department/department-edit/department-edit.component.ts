import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/poseidon-services/department.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.scss']
})
export class DepartmentEditComponent {
  private languageSubscription!: Subscription;
  @Input() departmentId!: string;

  updateForm: FormGroup;
  department: any;

  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<DepartmentEditComponent>

  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toDepartments();
        toastr.warning('No tienes permisos para editar');
      }
    });

    this.updateForm = this.formBuilder.group({
      name: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getDepartment();

  }

  getDepartment() {
    this.departmentService.getById(this.departmentId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.department = response.data;
          this.updateForm.patchValue({
            name: this.department.name
          })
        } else {
          this.toastr.error('Ha ocurrido un problema al consultar el departamento', response.message);
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar el departamento', error);
      }
    );
  }

  updateDepartment() {
    if (this.updateForm.valid) {
      this.departmentService.update(this.departmentId, this.updateForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`Departamento ${response.data.name} actualizado satisfactoriamente`);
            this.dialogRef.close();
          } else {
            this.toastr.error('Ha ocurrido un problema al actualizar el departamento');
          }
        }, (error) => {
          console.error("Error", error);
        }
      );
    }
  }

  toDepartments() {
    this.router.navigate(['/poseidon/department/list']);
  }

}
