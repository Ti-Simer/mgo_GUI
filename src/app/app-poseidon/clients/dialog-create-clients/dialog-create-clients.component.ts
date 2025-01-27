import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-clients',
  templateUrl: './dialog-create-clients.component.html',
  styleUrls: ['./dialog-create-clients.component.scss']
})
export class DialogCreateClientsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateClientsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
