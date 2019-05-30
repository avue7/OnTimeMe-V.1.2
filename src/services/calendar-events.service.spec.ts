import { TestBed } from '@angular/core/testing';

import { CalendarEventsService } from './calendar-events.service';

describe('CalendarEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalendarEventsService = TestBed.get(CalendarEventsService);
    expect(service).toBeTruthy();
  });
});
