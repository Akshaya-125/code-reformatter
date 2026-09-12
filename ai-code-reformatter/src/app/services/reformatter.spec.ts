import { TestBed } from '@angular/core/testing';

import { Reformatter } from './reformatter';

describe('Reformatter', () => {
  let service: Reformatter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reformatter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
