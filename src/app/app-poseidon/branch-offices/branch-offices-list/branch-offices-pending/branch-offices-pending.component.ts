import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';

@Component({
  selector: 'app-branch-offices-pending',
  templateUrl: './branch-offices-pending.component.html',
  styleUrls: ['./branch-offices-pending.component.scss']
})

export class BranchOfficesPendingComponent {
  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  listUrl: string = '../../../../assets/images/icons/list.svg';
  cardUrl: string = '../../../../assets/images/icons/card.svg';

  branchOffices: any[] = [];
  isList: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private branchOfficesService: BranchOfficesService,
    private dialogService: DialogService,
    private toastr: ToastrService
  ) {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }
  ngOnInit(): void {
    this.fetchBranchOffices();
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }
  }

  // Método para manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.onPageChange(event);
      });

      this.initializeSearchFilter();
    }
  }

  initializeSearchFilter() {
    if (this.searchInput) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#myTable tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  listOn() {
    this.isList = true;
  }

  listOff() {
    this.isList = false;
  }

  fetchBranchOffices(): void {
    this.branchOfficesService.getAllPending().subscribe(
      response => {
        if (response.statusCode === 200) {
          this.branchOffices = response.data;
        } else {
          this.toastr.info('No hay sucursales pendientes')
        }
      },
      error => {
        console.error('Error al obtener sucursales:', error);
      }
    );
  }

  deleteBranchOffice(branchOffice: any) {
    this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar el rol de ${branchOffice.name} ?`)
      .subscribe(result => {
        if (result) {
          this.branchOfficesService.delete(branchOffice.id).subscribe(
            (response) => {
              if (response.statusCode === 200) {
                this.toastr.success('Sucursal eliminada exitosamente', 'Éxito');
                this.fetchBranchOffices();
              } else {
                this.toastr.error('Error al eliminar Sucursal', response.message);
              }
            },
            (error) => {
              this.toastr.error('Error al eliminar Sucursal', 'Error');
            }
          );
        }
      });
  }

  toHome() {
    this.router.navigate(['/poseidon/home']);
  }

  toEditBranchOffice(id: any) {
    this.router.navigate(['/poseidon/branch-offices/edit', id]);
  }

  toCreateBranchOffices() {
    this.router.navigate(['/poseidon/branch-offices/create']);
  }
}
