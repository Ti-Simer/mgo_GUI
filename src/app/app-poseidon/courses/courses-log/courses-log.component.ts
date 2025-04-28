import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import { DialogCoursesLogViewComponent } from '../dialog-courses-log-view/dialog-courses-log-view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-courses-log',
  templateUrl: './courses-log.component.html',
  styleUrls: ['./courses-log.component.scss']
})
export class CoursesLogComponent {

  courselogform: FormGroup;
  courseLogs: any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.courselogform = this.formBuilder.group({
      date: [null, Validators.required],
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    this.fetchCourseLogs();
  }

  fetchCourseLogs() {
    const data = this.courselogform.value;
    this.courseService.findByDate(data).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.toastr.success(response.message, 'Exito');
          this.courseLogs = response.data;
        } else {
          this.toastr.warning(response.message, 'Advertencia');
        }
      }
    )
  }

  sortData(data: string) { }

  toViewCourseLog(courselog: any) {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        const dialogRef = this.dialog.open(DialogCoursesLogViewComponent, {
          width: '1250px',
          data: { courselogId: courselog.uuid }
        });
      }
    });
  }

}
