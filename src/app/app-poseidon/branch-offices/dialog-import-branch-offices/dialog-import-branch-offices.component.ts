import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-import-branch-offices',
  templateUrl: './dialog-import-branch-offices.component.html',
  styleUrls: ['./dialog-import-branch-offices.component.scss']
})

export class DialogImportBranchOfficesComponent {
  constructor(
    
    public dialogRef: MatDialogRef<DialogImportBranchOfficesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
