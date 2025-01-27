import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NifService } from 'src/app/services/fenix-services/nif.service';

@Component({
  selector: 'app-import-nifs',
  templateUrl: './import-nifs.component.html',
  styleUrls: ['./import-nifs.component.scss']
})
export class ImportNifsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  pageSizeOptions: number[] = [100, 500, 1000, 2500]; // Opciones de tamaño de página
  pageSize: number = 100; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  csv: any[] = [];

  constructor(
    private nifService: NifService,
    private toastr: ToastrService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }

    this.initializeSearchFilter();

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
    }
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file) {
      this.importNifs(file);
    }
  }

  import() {
    this.nifService.createMultiple(this.csv).subscribe(
      response => {        
        if (response.statusCode == 200) {
          this.toastr.success(response.message + ' ' + response.data.length + ' NIFs');
        }
      }, (error) => {
        console.error(error);
      });
  }

  importNifs(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = (event.target as FileReader).result;
      const lines = (fileContent as string).split('\n');
      const jsonObjects = lines
        .filter(line => line.trim() !== '')  // filter out empty lines
        .slice(1)
        .map(line => {
          let [nif, category, tara, fecha_mtto] = line.split(',');
          nif = nif.replace(/"/g, '').trim();  // remove double quotes and trim
          category = category.replace(/"/g, '').trim();
          tara = tara.replace(/"/g, '').trim();
          fecha_mtto = fecha_mtto.replace(/"/g, '').trim();
          return { nif, category, tara, fecha_mtto };
        });
      this.csv = jsonObjects;
    };
    reader.readAsText(file);
  }

  toSearchNif() {
    this.router.navigate(['/fenix/nif/search']);
  }

}
