import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/poseidon-services/orders.service';

@Component({
  selector: 'app-orders-view',
  templateUrl: './orders-view.component.html',
  styleUrls: ['./orders-view.component.scss']
})
export class OrdersViewComponent {
  @Input() orderId!: string;
  order: any;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private orderService: OrdersService,
    public dialogRef: MatDialogRef<OrdersViewComponent>
  ) {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.dialogRef.close();
        toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  ngOnInit(): void {
    this.getOrder(this.orderId);
  }

  getOrder(id: any) {
    this.orderService.getById(id).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.order = response.data          
        } else {
          this.toastr.warning(response.message, 'Ha ocurrido un problema al obtener el pedido')
        }
      }, (error) => {
        console.error('Ha ocurrido un problema al obtener el pedido: ', error);
      }
    );
  }
}
