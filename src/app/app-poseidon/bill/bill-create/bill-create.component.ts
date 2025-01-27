import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BillService } from 'src/app/services/poseidon-services/bill.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { ClientService } from 'src/app/services/poseidon-services/client.service';
import { OrdersService } from 'src/app/services/poseidon-services/orders.service';
import { PropaneTruckService } from 'src/app/services/poseidon-services/propane-truck.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';

@Component({
  selector: 'app-bill-create',
  templateUrl: './bill-create.component.html',
  styleUrls: ['./bill-create.component.scss']
})
export class BillCreateComponent {
  billForm: FormGroup;
  key = '1dcT?s#&!C7o';
  showPassword: boolean = false;

  clients: any[] = [];
  branchOffices: any[] = [];
  operators: any[] = [];
  propaneTanks: any[] = [];
  orders: any[] = [];
  totalOrders: number = 0;
  payment_type: any = [
    { name: "EFECTIVO" },
    { name: "CREDITO" },
    { name: "DEBITO" },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private clientService: ClientService,
    private branchOfficeService: BranchOfficesService,
    private usuarioService: UsuarioService,
    private propaneTruckService: PropaneTruckService,
    private ordersService: OrdersService,
    private billService: BillService,
    private toastr: ToastrService
  ){
    this.billForm = this.formBuilder.group({
      client: [null, Validators.required],
      branch_office: [null, Validators.required],
      operator: [null, Validators.required],
      status: ['EFECTIVO', Validators.required],
      folio: ['', Validators.required],
      payment_type: ['', Validators.required],
      plate: [null, Validators.required],
      charge: this.formBuilder.group({
        densidad: ['', Validators.required],
        temperatura: ['', Validators.required],
        masaTotal: ['', Validators.required],
        volumenTotal: ['', Validators.required],
        horaInicial: ['', Validators.required],
        fechaInicial: ['', Validators.required],
        horaFinal: ['', Validators.required],
        fechaFinal: ['', Validators.required]
      }),
      auth: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchClients();
    this.fetchBranchOffices();
    this.fetchOperators();
    this.fetchPropaneTrucks();
    this.fetchOrders();
  }

  toHome() {
    this.router.navigate(['/poseidon/home']);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  fetchClients() {
    this.clientService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.clients = response.data;

        } else {
          this.toastr.info('Aún no se han creado ciudades');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar las ciudades', error);
      }
    );
  }

  fetchBranchOffices() {
    this.branchOfficeService.getAlls().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.branchOffices = response.data;

        } else {
          this.toastr.info('Aún no se han creado ciudades');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar las ciudades', error);
      }
    );
  }

  fetchOperators() {
    this.usuarioService.listOperators().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.operators = response.data;
        } else {
          this.toastr.info('Aún no se han creado ciudades');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar las ciudades', error);
      }
    );
  }

  fetchPropaneTrucks() {
    this.propaneTruckService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.propaneTanks = response.data;
        } else {
          this.toastr.info('Aún no se han creado ciudades');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar las ciudades', error);
      }
    );
  }

  fetchOrders() {
    const pageData = {
      pageData: {
        page: 1,
        limit: 50
      }
    };

    this.ordersService.getAll(pageData).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.totalOrders = response.data.total; // Total de elementos para la paginación
          this.orders = response.data.orders.sort((a: any, b: any) => {
            let dateA = new Date(a.folio); // o a.update dependiendo de qué fecha quieres usar
            let dateB = new Date(b.folio); // o b.update dependiendo de qué fecha quieres usar
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });
        } else {
          this.toastr.info('Aún no se han creado ciudades');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar las ciudades', error);
      }
    );
  }

  setPageSizeToTotalOrders() {
    const pageData = {
      pageData: {
        page: 1,
        limit: this.totalOrders
      }
    };

    this.ordersService.getAll(pageData).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.totalOrders = response.data.total; // Total de elementos para la paginación
          this.orders = response.data.orders.sort((a: any, b: any) => {
            let dateA = new Date(a.folio); // o a.update dependiendo de qué fecha quieres usar
            let dateB = new Date(b.folio); // o b.update dependiendo de qué fecha quieres usar
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });
        } else {
          this.toastr.info('Aún no se han creado ciudades');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar las ciudades', error);
      }
    );
  }

  // setPageSizeToTotalClients() {
  //   const pageData = {
  //     pageData: {
  //       page: 1,
  //       limit: this.total
  //     }
  //   };

  //   this.ordersService.getAll(pageData).subscribe(
  //     response => {
  //       if (response.statusCode == 200) {
  //         this.totalOrders = response.data.total; // Total de elementos para la paginación
  //         this.orders = response.data.orders.sort((a: any, b: any) => {
  //           let dateA = new Date(a.folio); // o a.update dependiendo de qué fecha quieres usar
  //           let dateB = new Date(b.folio); // o b.update dependiendo de qué fecha quieres usar
  //           return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
  //         });
  //       } else {
  //         this.toastr.info('Aún no se han creado ciudades');
  //       }
  //     }, (error) => {
  //       console.error('Ha ocurrido un error al consultar las ciudades', error);
  //     }
  //   );
  // }

  onSubmit() {
    if (this.key !== this.billForm.value.auth) {
      this.toastr.error('La clave de autorización es incorrecta');
      return;
    }

    console.log('Formulario de factura:', this.billForm.value);

    if (this.billForm.valid) {
      this.billService.create(this.billForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`Remision ${response.data.bill_code} creada satisfactoriamente`, `Exito`);
          } else {
            this.toastr.error(response.message, 'ha ocurrido un problema al crear la ciudad');
          }
        }, (error) => {
          console.error('Ha ocurrido un error al crear la ciudad: ', error);
        }
      );

    }
  }
    
}
