import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import { DatePipe } from '@angular/common';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-courses-operator',
  templateUrl: './courses-operator.component.html',
  styleUrls: ['./courses-operator.component.scss']
})
export class CoursesOperatorComponent {
  private languageSubscription!: Subscription;

  course: any

  //Variables de verificación
  userId: any;
  user: any

  constructor(
    private router: Router,
    private authService: AuthService,
    private courseService: CourseService,
    private usuarioService: UsuarioService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.userId = this.authService.getUserFromToken();
    this.getUserById();
    this.getCoursesByOperatorId();
  }

  getUserById() {
    this.usuarioService.getUserById(this.userId).subscribe(
      (response) => {
        this.user = response.data;
      },
      (error) => {
        console.error('Error al obtener el permiso por ID:', error);
      }
    );
  }

  getCoursesByOperatorId() {
    this.courseService.getCourseByOperatorId(this.userId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.course = response.data;
          console.log(this.course);

        } else {
          this.toastr.info(`${this.user.firstName} no tienes derroteros pendientes`);
          this.router.navigate(['/poseidon/home']);
        }
      }, (error) => {
        console.error("Error en la petición", error);
      }
    )
  }

  toView(id: any) {
    this.router.navigate(['/poseidon/courses/view', this.authService.encryptData(id)]);
  }

}
