import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditClientsComponent } from './dialog-edit-clients.component';

describe('DialogEditClientsComponent', () => {
  let component: DialogEditClientsComponent;
  let fixture: ComponentFixture<DialogEditClientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditClientsComponent]
    });
    fixture = TestBed.createComponent(DialogEditClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
