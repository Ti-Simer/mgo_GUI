import { Component, Input } from '@angular/core';
import { DialogViewOrdersComponent } from '../dialog-view-orders/dialog-view-orders.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders-list-course',
  templateUrl: './orders-list-course.component.html',
  styleUrls: ['./orders-list-course.component.scss']
})
export class OrdersListCourseComponent {
  @Input() course!: any;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    if (this.course) {
      console.log('Course:', this.course);
    }
  }

  getCriticalityColor(criticality: string): string {
    switch (criticality) {
      case 'FINALIZADO':
        return '#2bca80';
      case 'DISPONIBLE':
        return '#0DCAF0';
      case 'EN CURSO':
        return '#e0b76f';
      default:
        return 'grey';
    }
  }

  toViewOrder(order: any) {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        const dialogRef = this.dialog.open(DialogViewOrdersComponent, {
          width: '460px',
          data: { orderId: order.id }
        });
      }
    });
  }
}
