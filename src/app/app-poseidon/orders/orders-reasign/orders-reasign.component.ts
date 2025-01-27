import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DialogService } from 'src/app/services/dialog.service';
import { forkJoin } from 'rxjs'; // Asegúrate de tener esta línea al inicio de tu archivo
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-orders-reasign',
  templateUrl: './orders-reasign.component.html',
  styleUrls: ['./orders-reasign.component.scss']
})
export class OrdersReasignComponent {

  courses: any[] = [];
  course1: any
  course2: any
  orders1: any[] = [];
  orders2: any[] = [];
  selectedCourseId1: any;
  selectedCourseId2: any;

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private toastr: ToastrService,
    private router: Router,
    private dialogService: DialogService,
    public dialogRef: MatDialogRef<OrdersReasignComponent>
  ) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toCourses();
        toastr.warning('No tienes permisos para editar');
      }
    });

    this.orders1 = [];
    this.orders2 = [];
  }

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses() {
    this.courseService.getAll().subscribe(
      (response) => {
        if (response.statusCode !== 200) {
          this.toastr.info('No hay derroteros creados  <a href="/poseidon/courses/create">Asignar</a>', 'Información', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'increasing',
            closeButton: true,
            enableHtml: true
          });

          this.router.navigate(['/poseidon/courses/admin']);
          return;
        }
        this.courses = response.data;
      },
      (error) => {
        console.error('Error al obtener los cursos:', error);
      }
    );
  }

  onCourseSelectionChange(id: any): void {
    const selectedCourse = this.courses.find(course => course.id === id);
    this.orders1 = selectedCourse && Array.isArray(selectedCourse.orders) ? selectedCourse.orders : [];
    this.course1 = selectedCourse;
  }

  onCourseSelectionChange2(id: any): void {
    const selectedCourse = this.courses.find(course => course.id === id);
    this.orders2 = selectedCourse && Array.isArray(selectedCourse.orders) ? selectedCourse.orders : [];
    this.course2 = selectedCourse;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (!event.previousContainer.data || !event.container.data) {
      console.error('Container data is undefined:', event.container);
      return;
    }

    // Accede al elemento que se está moviendo
    const movingItem = event.previousContainer.data[event.previousIndex];

    if (movingItem.branch_office.status === 'EFECTIVO') {
      this.toastr.warning('No puedes reasignar un pedido efectivo', 'Advertencia!');
      return;
    }

    // Verifica si el contenedor de destino está vacío
    if (event.container.data.length === 0) {
      this.toastr.warning('No puedes mover un pedido a un contenedor vacío', 'Advertencia!');
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  moveOrder(order: any) {
    if (!this.orders1.includes(order)) {
      this.orders1.push(order);
      this.orders2 = this.orders2.filter(item => item !== order);
    } else {
      this.orders2.push(order);
      this.orders1 = this.orders1.filter(item => item !== order);
    }
  }

  toCourses() {
    this.router.navigate(['/poseidon/courses/admin']);
  }

  deleteCourse(courseId: string) {
    this.courseService.deleteOnReasign(courseId).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.toastr.info('Derrotero eliminado exitosamente', 'Información');
          this.toCourses();
        } else {
          this.toastr.warning('Ocurrió un error al eliminar el derrotero');
        }
      },
      error => {
        this.toastr.error('Ha ocurrido un error al eliminar el derrotero', error);
      }
    );
  }

  onSubmit() {
    this.dialogService.openConfirmDialog('¿Esta seguro que desea realizar los cambios?, recuerde que esta información sera modificada y se verá reflejada cuando el operario descargue los datos nuevamente')
      .subscribe(result => {
        if (result) {
          const courseData = [
            {
              id: this.selectedCourseId1,
              orders: this.orders1.map(order => order.id),
            },
            {
              id: this.selectedCourseId2,
              orders: this.orders2.map(order => order.id),
            }
          ]


          if (this.orders1.length === 0 || this.orders2.length === 0) {

            if (this.orders1.length === 0) {
              this.deleteCourse(this.selectedCourseId1);
            }

            if (this.orders2.length === 0) {
              this.deleteCourse(this.selectedCourseId2);
            }

          }

          const observables = courseData.map(course => {
            const data = {
              orders: course.orders
            }

            return this.courseService.updateCourse(course.id, data);
          });

          forkJoin(observables).subscribe((responses: any[]) => { // Define explícitamente el tipo de 'responses'  
            if (responses.every((response: any) => response.statusCode === 200)) { // Define explícitamente el tipo de 'response'
              this.dialogRef.close();
              this.toastr.success('Los pedidos se han reasignado correctamente');
            } else {
              this.toastr.warning('Ocurrió un error al reasignar los pedidos');
            }
          });
        }
      });

  }

}
