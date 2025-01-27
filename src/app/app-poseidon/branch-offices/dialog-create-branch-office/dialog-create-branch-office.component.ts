import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-branch-office',
  templateUrl: './dialog-create-branch-office.component.html',
  styleUrls: ['./dialog-create-branch-office.component.scss']
})
export class DialogCreateBranchOfficeComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateBranchOfficeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
