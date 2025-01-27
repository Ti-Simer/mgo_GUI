import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-city',
  templateUrl: './dialog-edit-city.component.html',
  styleUrls: ['./dialog-edit-city.component.scss']
})
export class DialogEditCityComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditCityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
