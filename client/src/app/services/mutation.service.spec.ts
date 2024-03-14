import { TestBed } from '@angular/core/testing';

import { MutationService } from './mutation.service';

describe('MutationService', () => {
  let service: MutationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MutationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
