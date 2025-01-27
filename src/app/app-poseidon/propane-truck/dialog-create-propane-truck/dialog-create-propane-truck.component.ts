import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-propane-truck',
  templateUrl: './dialog-create-propane-truck.component.html',
  styleUrls: ['./dialog-create-propane-truck.component.scss']
})
export class DialogCreatePropaneTruckComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreatePropaneTruckComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
