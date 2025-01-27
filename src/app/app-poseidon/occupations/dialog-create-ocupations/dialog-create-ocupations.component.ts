import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-ocupations',
  templateUrl: './dialog-create-ocupations.component.html',
  styleUrls: ['./dialog-create-ocupations.component.scss']
})
export class DialogCreateOcupationsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateOcupationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
