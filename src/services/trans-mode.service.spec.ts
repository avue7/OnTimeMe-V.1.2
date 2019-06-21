import { TestBed } from '@angular/core/testing';

import { TransModeService } from './trans-mode.service';

describe('TransModeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransModeService = TestBed.get(TransModeService);
    expect(service).toBeTruthy();
  });
});
