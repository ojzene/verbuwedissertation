import { TestBed } from '@angular/core/testing';

import { VerbdictionaryService } from './verbdictionary.service';

describe('VerbdictionaryService', () => {
  let service: VerbdictionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerbdictionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
