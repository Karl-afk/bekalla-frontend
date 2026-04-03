import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultTasks } from './default-tasks';

describe('DefaultTasks', () => {
  let component: DefaultTasks;
  let fixture: ComponentFixture<DefaultTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultTasks],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
