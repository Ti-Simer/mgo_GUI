import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  branch_offices: any[] = [];
  filteredBranchOffices!: Observable<any[]>;
  filteredClients!: Observable<any[]>;
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
  ) {
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

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.branch_offices.filter(branch_office => branch_office.name.toLowerCase().includes(filterValue));
  }

  private _filterClients(value: string): any[] {
    const filterValue = (value || '').toLowerCase();
    return this.clients.filter(client => {
      const firstName = client.firstName?.toLowerCase() || '';
      const lastName = client.lastName?.toLowerCase() || '';
      const cc = client.cc?.toLowerCase() || '';
      return firstName.includes(filterValue) || lastName.includes(filterValue) || cc.includes(filterValue);
    });
  }

  displayFnBranchOffices(branch_office: any): string {
    return branch_office && branch_office.name ? `${branch_office.name} - ${branch_office.nit}` : '';
  }

  displayFnClients(client: any): string {
    return client ? `${client.firstName} ${client.lastName} - ${client.cc}` : '';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  fetchClients() {
    this.clientService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.clients = response.data;

          this.filteredClients = this.billForm.get('client')!.valueChanges.pipe(
            startWith(''),
            map(value => {
              const filterText = typeof value === 'string' ? value : this.displayFnClients(value); // <- Usa displayFnClients
              return this._filterClients(filterText);
            })
          );
        } else {
          this.toastr.info('No se han encontrado clientes');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar los clientes', error);
      }
    );
  }

  fetchBranchOffices() {
    this.branchOfficeService.getAlls().subscribe(
      (response) => {
        this.branch_offices = response.data;
        this.filteredBranchOffices = this.billForm.get('branch_office')!.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      },
      (error) => {
        console.error('Error al obtener los establecimientos:', error);
      }
    );
  }

  fetchOperators() {
    this.usuarioService.listOperators().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.operators = response.data;
        } else {
          this.toastr.info('No se han encontrado operadores');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar los operadores', error);
      }
    );
  }

  fetchPropaneTrucks() {
    this.propaneTruckService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.propaneTanks = response.data;
        } else {
          this.toastr.info('No se han encontrado auto-tanques');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar los auto-tanques', error);
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
          this.toastr.info('No se han encontrado pedidos');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar los pedidos', error);
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
          this.toastr.info('No se han encontrado pedidos');
        }
      }, (error) => {
        console.error('Ha ocurrido un error al consultar los pedidos', error);
      }
    );
  }

  onSubmit() {
    if (this.key !== this.billForm.value.auth) {
      this.toastr.error('La clave de autorización es incorrecta');
      return;
    }

    if (this.billForm.valid) {

      const data = {
        client: this.billForm.value.client.id,
        charge: this.billForm.value.charge,
        branch_office: this.billForm.value.branch_office.id,
        operator: this.billForm.value.operator,
        status: this.billForm.value.status,
        folio: this.billForm.value.folio,
        payment_type: this.billForm.value.payment_type,
        plate: this.billForm.value.plate,
      }

      this.billService.create(data).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`Remision ${response.data.bill_code} creada satisfactoriamente`, `Exito`);
          } else {
            this.toastr.error(response.message, 'ha ocurrido un problema al crear la remisión');
          }
        }, (error) => {
          console.error('Ha ocurrido un error al crear la remisión: ', error);
        }
      );

    }
  }

  toHome() {
    this.router.navigate(['/poseidon/home']);
  }

}