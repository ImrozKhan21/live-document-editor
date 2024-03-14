import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSelectorComponent } from './doc-selector.component';

describe('DocSelectorComponent', () => {
  let component: DocSelectorComponent;
  let fixture: ComponentFixture<DocSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocSelectorComponent]
    });
    fixture = TestBed.createComponent(DocSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
