import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStay } from './edit-stay';

describe('EditStay', () => {
  let component: EditStay;
  let fixture: ComponentFixture<EditStay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStay],
    }).compileComponents();

    fixture = TestBed.createComponent(EditStay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
