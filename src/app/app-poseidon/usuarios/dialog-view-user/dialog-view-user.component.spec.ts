import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewUserComponent } from './dialog-view-user.component';

describe('DialogViewUserComponent', () => {
  let component: DialogViewUserComponent;
  let fixture: ComponentFixture<DialogViewUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogViewUserComponent]
    });
    fixture = TestBed.createComponent(DialogViewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
