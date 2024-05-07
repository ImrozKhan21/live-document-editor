import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, of, switchMap} from "rxjs";
import {MutationService} from "../../services/mutation.service";
import {DocEditorService} from "../../services/doc-editor.service";
import {AppStateService} from "../../services/app-state.service";

@Component({
  selector: 'app-doc-editor',
  templateUrl: './doc-editor.component.html',
  styleUrls: ['./doc-editor.component.scss']
})
export class DocEditorComponent implements OnInit {
  @Input() selectedDocument: any;
  @ViewChild('docInput') docInput: any;

  apiKey = "f2uc4rzlhp9o9wtra8zmxxcr6nclfwxgdto6qabmoyhoj9vz";
  dataModel: any;
  docField: any;
  docForm: FormGroup | undefined;
  currentContent: any;

  constructor(private fb: FormBuilder, private mutationService: MutationService,
              private docEditorService: DocEditorService, private appStateService: AppStateService) {
  }

  ngOnInit() {
    if (this.selectedDocument) {
      console.log('selectedDocument', this.selectedDocument.content, this.appStateService.loggedInUser)
      this.currentContent = this.selectedDocument.content;
    }
    this.docField = new FormControl({value: this.currentContent, disabled: false});
    this.docForm = this.fb.group({docControl: this.docField});
    this.subscribeToDocChanges();
    this.subscribeToLiveUpdates();
  }

  subscribeToDocChanges() {
    const {email} = this.appStateService.loggedInUser;
    this.docField.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      switchMap((content: any) => {
        return of(content)
      })
    ).subscribe(async (content: string) => {
      await this.mutationService.updateDoc(content, email);
    });
  }

  subscribeToLiveUpdates() {
    const currentDocument = this.docEditorService.selectedDocument;
    if (currentDocument) {
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
