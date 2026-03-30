import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStay } from './new-stay';

describe('NewStay', () => {
  let component: NewStay;
  let fixture: ComponentFixture<NewStay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStay],
    }).compileComponents();

    fixture = TestBed.createComponent(NewStay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
