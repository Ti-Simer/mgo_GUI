import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  // Primer conjunto de datos
  private datosSource = new BehaviorSubject<any>(null);
  datos$ = this.datosSource.asObservable();

  emit_data(data: any) {
    this.datosSource.next(data);
  }

  // Segundo conjunto de datos
  private secondDataSource = new BehaviorSubject<any>(null);
  secondData$ = this.secondDataSource.asObservable();

  emit_second_data(data: any) {
    this.secondDataSource.next(data);
  }

  // Tercer conjunto de datos (orders)
  private ordersDataSource = new BehaviorSubject<any>(null);
  ordersData$ = this.ordersDataSource.asObservable();

  emit_orders_data(data: any) {
    this.ordersDataSource.next(data);
  }
}
