import { TestBed } from '@angular/core/testing';

import { NativeCalendarService } from './native-calendar.service';

describe('NativeCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NativeCalendarService = TestBed.get(NativeCalendarService);
    expect(service).toBeTruthy();
  });
});
