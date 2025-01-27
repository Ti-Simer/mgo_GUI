import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-city',
  templateUrl: './dialog-create-city.component.html',
  styleUrls: ['./dialog-create-city.component.scss']
})
export class DialogCreateCityComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateCityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
