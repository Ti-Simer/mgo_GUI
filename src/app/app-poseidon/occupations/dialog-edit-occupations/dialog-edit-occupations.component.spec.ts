import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditOccupationsComponent } from './dialog-edit-occupations.component';

describe('DialogEditOccupationsComponent', () => {
  let component: DialogEditOccupationsComponent;
  let fixture: ComponentFixture<DialogEditOccupationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditOccupationsComponent]
    });
    fixture = TestBed.createComponent(DialogEditOccupationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
