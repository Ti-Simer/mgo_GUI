import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-resume-data',
  templateUrl: './dialog-resume-data.component.html',
  styleUrls: ['./dialog-resume-data.component.scss']
})
export class DialogResumeDataComponent {
    constructor(
      public dialogRef: MatDialogRef<DialogResumeDataComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    
    onClose(): void {
      this.dialogRef.close();
    }
}
