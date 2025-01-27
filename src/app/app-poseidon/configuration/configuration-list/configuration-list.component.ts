import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ConfigurationService } from 'src/app/services/poseidon-services/configuration.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-configuration-list',
  templateUrl: './configuration-list.component.html',
  styleUrls: ['./configuration-list.component.scss']
})
export class ConfigurationListComponent {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  image = new Image();
  croppedImage: string | null = null;
  croppedBlob: Blob | null = null;

  private isDragging = false;
  private selectionStart = { x: 0, y: 0 };
  private selectionEnd = { x: 0, y: 0 };
  private context!: CanvasRenderingContext2D;

  configurationForm: FormGroup;
  selectedFile: any;
  filteredCountryCodes!: Observable<any[]>;

  country_codes: any[] = [
    { code: '+1', name: 'United States/Canada/Caribbean' },
    { code: '+52', name: 'Mexico' },
    { code: '+57', name: 'Colombia' },
    { code: '+54', name: 'Argentina' },
    { code: '+56', name: 'Chile' },
    { code: '+593', name: 'Ecuador' },
    { code: '+51', name: 'Peru' },
    { code: '+55', name: 'Brazil' },
    { code: '+58', name: 'Venezuela' },
    { code: '+502', name: 'Guatemala' },
    { code: '+503', name: 'El Salvador' },
    { code: '+504', name: 'Honduras' },
    { code: '+505', name: 'Nicaragua' },
    { code: '+506', name: 'Costa Rica' },
    { code: '+507', name: 'Panama' },
    { code: '+591', name: 'Bolivia' },
    { code: '+598', name: 'Uruguay' },
    { code: '+595', name: 'Paraguay' },
    { code: '+592', name: 'Guyana' },
    { code: '+594', name: 'French Guiana' },
    { code: '+590', name: 'Guadeloupe' },
    { code: '+597', name: 'Suriname' },
    { code: '+509', name: 'Haiti' },
    { code: '+1-441', name: 'Bermuda' },
    { code: '+1-868', name: 'Trinidad and Tobago' },
    { code: '+1-876', name: 'Jamaica' },
    { code: '+1-758', name: 'Saint Lucia' },
    { code: '+1-784', name: 'Saint Vincent and the Grenadines' },
    { code: '+1-721', name: 'Sint Maarten' },
    { code: '+1-473', name: 'Grenada' },
    { code: '+1-246', name: 'Barbados' },
    { code: '+1-268', name: 'Antigua and Barbuda' },
    { code: '+1-869', name: 'Saint Kitts and Nevis' },
    { code: '+1-264', name: 'Anguilla' },
    { code: '+1-284', name: 'British Virgin Islands' },
    { code: '+1-345', name: 'Cayman Islands' },
    { code: '+1-242', name: 'Bahamas' },
    { code: '+1-721', name: 'Sint Maarten' },
    { code: '+1-664', name: 'Montserrat' }
  ];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    private configurationService: ConfigurationService,
  ) {
    this.configurationForm = this.formBuilder.group({
      company: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      country_code: [null, Validators.required],
      country: [null, Validators.required],
      image: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.filteredCountryCodes = this.configurationForm.get('country_code')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.country_codes.filter(country_code => country_code.name.toLowerCase().includes(filterValue));
  }

  displayFn(country_code: any): string {
    return country_code && country_code.name ? `${country_code.name} (${country_code.code})` : '';
  }

  onCountryCodeSelected(event: any): void {
    const selectedCountry = event.option.value;
    if (selectedCountry) {
      this.configurationForm.get('country_code')?.setValue(selectedCountry.code);
      this.configurationForm.get('country')?.setValue(selectedCountry.name);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.image.src = e.target?.result as string;
        this.image.onload = () => this.drawCanvas();
      };
      reader.readAsDataURL(file);
    }
  }

  private drawCanvas(): void {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d')!;
    canvas.width = 630;
    canvas.height = 300;

    // Dibuja la imagen en el canvas
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.drawImage(this.image, 0, 0, canvas.width, canvas.height);

    // Vincula eventos de mouse al canvas
    this.attachMouseEvents();
  }

  private attachMouseEvents(): void {
    const canvas = this.canvas.nativeElement;

    canvas.addEventListener('mousedown', (event) => this.startSelection(event));
    canvas.addEventListener('mousemove', (event) => this.updateSelection(event));
    canvas.addEventListener('mouseup', () => this.endSelection());
  }

  private startSelection(event: MouseEvent): void {
    this.isDragging = true;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.selectionStart = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    this.selectionEnd = { ...this.selectionStart };
  }

  private updateSelection(event: MouseEvent): void {
    if (!this.isDragging) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.selectionEnd = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    // Redibujar el área de selección
    this.redrawCanvas();
  }

  private endSelection(): void {
    this.isDragging = false;
  }

  private redrawCanvas(): void {
    // Redibujar la imagen en el canvas
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.context.drawImage(this.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Dibujar el rectángulo de selección
    const x = Math.min(this.selectionStart.x, this.selectionEnd.x);
    const y = Math.min(this.selectionStart.y, this.selectionEnd.y);
    const width = Math.abs(this.selectionEnd.x - this.selectionStart.x);
    const height = Math.abs(this.selectionEnd.y - this.selectionStart.y);

    this.context.strokeStyle = 'red';
    this.context.lineWidth = 2;
    this.context.strokeRect(x, y, width, height);
  }

  cropImage(): void {
    const canvas = this.canvas.nativeElement;
    const croppedCanvas = document.createElement('canvas');
    const ctx = croppedCanvas.getContext('2d')!;

    // Obtener las dimensiones del área seleccionada
    const x = Math.min(this.selectionStart.x, this.selectionEnd.x);
    const y = Math.min(this.selectionStart.y, this.selectionEnd.y);
    const width = Math.abs(this.selectionEnd.x - this.selectionStart.x);
    const height = Math.abs(this.selectionEnd.y - this.selectionStart.y);

    // Configurar las dimensiones del nuevo canvas
    croppedCanvas.width = width;
    croppedCanvas.height = height;

    // Extraer la región seleccionada
    ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

    // Convertir el resultado a Base64
    const base64Image = croppedCanvas.toDataURL('image/png');

    // Convertir Base64 a Blob
    const byteString = atob(base64Image.split(',')[1]);
    const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // Crear un archivo a partir del Blob
    const file = new File([blob], 'croppedImage.png', { type: mimeString });

    console.log(file);

    // Asignar la imagen recortada a croppedImage para previsualización (opcional)
    this.croppedImage = base64Image;

    this.croppedBlob = new Blob([ab], { type: mimeString });
    this.croppedImage = base64Image;
  }

  onSubmit() {
    if (!this.croppedBlob) {
      alert('Primero recorte la imagen.');
      return;
    }

    // Crear FormData para enviar los datos
    const formData = new FormData();
    formData.append('company', this.configurationForm.get('company')?.value);
    formData.append('email', this.configurationForm.get('email')?.value);
    formData.append('phone', this.configurationForm.get('phone')?.value);
    formData.append('country_code', this.configurationForm.get('country_code')?.value);
    formData.append('country', this.configurationForm.get('country')?.value);
    formData.append('image', this.croppedBlob, 'croppedImage.png');

    // Imprimir los datos en la consola
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    console.log(this.configurationForm.value);

    // Enviar FormData al backend
    this.configurationService.create(formData).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.router.navigate(['/poseidon/home']);
          this.toastr.success('Hoja de configuración recibida', 'Éxito!');
        } else {
          this.toastr.warning('Ha ocurrido un error al enviar el formulario', 'Advertencia!');
        }
      },
      error => {
        console.error('Error al enviar el formulario:', error);
        this.toastr.error('Error al enviar el formulario');
      }
    );
  }

}
