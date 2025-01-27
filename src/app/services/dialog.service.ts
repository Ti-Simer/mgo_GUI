import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from '../dialog/info-dialog/info-dialog.component';
import { InfoConfirmDialogComponent } from '../dialog/info-confirm-dialog/info-confirm-dialog.component';
import { LoadingDialogComponent } from '../dialog/loading-dialog/loading-dialog.component';
import { LoadingSmallDialogComponent } from '../dialog/loading-small-dialog/loading-small-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message }
    });

    return dialogRef.afterClosed();
  }

  openInfoDialog(message: string, title: string): void {
    this.dialog.open(InfoDialogComponent, {
      width: '650px',
      data: { message, title }
    });
  }

  openInfoConfirmDialog(message: string, title: string): Observable<boolean> {
    const dialogRef = this.dialog.open(InfoConfirmDialogComponent, {
      width: '650px',
      data: { message, title }
    });

    return dialogRef.afterClosed();
  }

  openLoadingDialog(): MatDialogRef<LoadingDialogComponent> {
    return this.dialog.open(LoadingDialogComponent, {
      width: '150px',
      panelClass: 'transparent-dialog',
      disableClose: true
    });
  }

  openLoadingDialogSmall(): MatDialogRef<LoadingSmallDialogComponent> {
    return this.dialog.open(LoadingSmallDialogComponent, {
      width: '70px',
      panelClass: 'transparent-dialog',
      disableClose: true
    });
  }
}
