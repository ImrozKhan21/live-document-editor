import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, of, switchMap} from "rxjs";
import {QueryService} from "../../services/query.service";
import {MutationService} from "../../services/mutation.service";
import {DocEditorService} from "../../services/doc-editor.service";

@Component({
  selector: 'app-doc-editor',
  templateUrl: './doc-editor.component.html',
  styleUrls: ['./doc-editor.component.scss']
})
export class DocEditorComponent implements OnInit {
  apiKey = "f2uc4rzlhp9o9wtra8zmxxcr6nclfwxgdto6qabmoyhoj9vz";
  dataModel: any;
  docField: any;
  docForm: FormGroup | undefined;
  currentContent: any;

  constructor(private fb: FormBuilder, private mutationService: MutationService, private docEditorService: DocEditorService) {
  }

  ngOnInit() {
    this.docField = new FormControl();
    this.docForm = this.fb.group({docControl: this.docField});
    this.subscribeToDocChanges();
    this.subscribeToLiveUpdates();
  }

  subscribeToDocChanges() {
    this.docField.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      switchMap( (content: any) => {
        return of(content)
      })
    ).subscribe(async (content: string) => {
      await this.mutationService.updateDoc(content);
    });
  }

  subscribeToLiveUpdates() {
    const currentDocument = this.docEditorService.selectedDocument;

    if(currentDocument) {
      this.docEditorService.getSelectedDocLatestContent().subscribe((data) => {
        this.currentContent = data;
        this.docForm?.patchValue({
          docControl: data,
          // formControlName2: myValue2 (can be omitted)
        }, {emitEvent: false, onlySelf: true});
      });
    }
  }

  onDataChange(event: any) {
    console.log(event);
    this.dataModel = event;
  }
}
