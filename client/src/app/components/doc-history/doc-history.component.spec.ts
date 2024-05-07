import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocHistoryComponent } from './doc-history.component';

describe('DocHistoryComponent', () => {
  let component: DocHistoryComponent;
  let fixture: ComponentFixture<DocHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
