import { TestBed } from '@angular/core/testing';

import { DocEditorService } from './doc-editor.service';

describe('DocEditorService', () => {
  let service: DocEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
