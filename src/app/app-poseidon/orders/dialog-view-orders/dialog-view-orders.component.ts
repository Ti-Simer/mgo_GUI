import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view-orders',
  templateUrl: './dialog-view-orders.component.html',
  styleUrls: ['./dialog-view-orders.component.scss']
})
export class DialogViewOrdersComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogViewOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
