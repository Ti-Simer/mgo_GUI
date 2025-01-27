import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-propane-truck',
  templateUrl: './dialog-edit-propane-truck.component.html',
  styleUrls: ['./dialog-edit-propane-truck.component.scss']
})
export class DialogEditPropaneTruckComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditPropaneTruckComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
