import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-import-clients',
  templateUrl: './dialog-import-clients.component.html',
  styleUrls: ['./dialog-import-clients.component.scss']
})

export class DialogImportClientsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogImportClientsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
