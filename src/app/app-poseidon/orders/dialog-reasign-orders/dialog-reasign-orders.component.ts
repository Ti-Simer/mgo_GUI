import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-reasign-orders',
  templateUrl: './dialog-reasign-orders.component.html',
  styleUrls: ['./dialog-reasign-orders.component.scss']
})
export class DialogReasignOrdersComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogReasignOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
