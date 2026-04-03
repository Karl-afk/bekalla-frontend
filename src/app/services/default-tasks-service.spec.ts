import { TestBed } from '@angular/core/testing';

import { DefaultTasksService } from './default-tasks-service';

describe('DefaultTasksService', () => {
  let service: DefaultTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
