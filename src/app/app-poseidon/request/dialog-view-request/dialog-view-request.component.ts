import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view-request',
  templateUrl: './dialog-view-request.component.html',
  styleUrls: ['./dialog-view-request.component.scss']
})
export class DialogViewRequestComponent {

    constructor(
      public dialogRef: MatDialogRef<DialogViewRequestComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    
    onClose(): void {
      this.dialogRef.close();
    }
}
