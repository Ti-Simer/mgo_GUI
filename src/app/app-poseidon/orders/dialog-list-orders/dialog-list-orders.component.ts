import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-list-orders',
  templateUrl: './dialog-list-orders.component.html',
  styleUrls: ['./dialog-list-orders.component.scss']
})
export class DialogListOrdersComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogListOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
