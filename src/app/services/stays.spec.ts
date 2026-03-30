import { TestBed } from '@angular/core/testing';

import { Stays } from './stays';

describe('Stays', () => {
  let service: Stays;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Stays);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
