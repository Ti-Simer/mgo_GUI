import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSmallDialogComponent } from './loading-small-dialog.component';

describe('LoadingSmallDialogComponent', () => {
  let component: LoadingSmallDialogComponent;
  let fixture: ComponentFixture<LoadingSmallDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingSmallDialogComponent]
    });
    fixture = TestBed.createComponent(LoadingSmallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
