import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-clients',
  templateUrl: './dialog-edit-clients.component.html',
  styleUrls: ['./dialog-edit-clients.component.scss']
})
export class DialogEditClientsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditClientsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
