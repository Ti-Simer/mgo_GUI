import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view-user',
  templateUrl: './dialog-view-user.component.html',
  styleUrls: ['./dialog-view-user.component.scss']
})
export class DialogViewUserComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogViewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
