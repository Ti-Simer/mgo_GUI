import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/poseidon-services/department.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss']
})
export class DepartmentCreateComponent {
  private languageSubscription!: Subscription;

  departmentForm: FormGroup;

  constructor(
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<DepartmentCreateComponent>

  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toDepartments();
        toastr.warning('No tienes permisos para crear');
      }
    });
    
    this.departmentForm = this.formBuilder.group({
      name: [null, Validators.required]
    });

  }

  ngOnInit(): void{
    
  }

  onSubmit() { 
    if (this.departmentForm.valid) {
      this.departmentService.create(this.departmentForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`Departamento ${response.data.name} creado satisfactoriamente`);
            this.dialogRef.close();
          } else {
            this.toastr.info('Ha ocurrido un problema al crear el departamento')
          }
        }, (error) => {
          console.error('ha ocurrido un error al crear el departamento', error);
        }
      );
    }
  }

  toDepartments() { 
    this.router.navigate(['/poseidon/department/list']);
  }

}
