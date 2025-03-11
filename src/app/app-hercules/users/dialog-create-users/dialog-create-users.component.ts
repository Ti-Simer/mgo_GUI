import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-users',
  templateUrl: './dialog-create-users.component.html',
  styleUrls: ['./dialog-create-users.component.scss']
})
export class DialogCreateUsersComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
