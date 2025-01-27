import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-branch-office',
  templateUrl: './dialog-edit-branch-office.component.html',
  styleUrls: ['./dialog-edit-branch-office.component.scss']
})
export class DialogEditBranchOfficeComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditBranchOfficeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
