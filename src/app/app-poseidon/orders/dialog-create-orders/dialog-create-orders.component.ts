import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-orders',
  templateUrl: './dialog-create-orders.component.html',
  styleUrls: ['./dialog-create-orders.component.scss']
})
export class DialogCreateOrdersComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
