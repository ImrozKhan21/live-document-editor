import {Component, OnInit} from '@angular/core';
import {QueryService} from "../../services/query.service";
import {DocEditorService} from "../../services/doc-editor.service";
import {AppStateService} from "../../services/app-state.service";
import {take} from "rxjs";

@Component({
  selector: 'app-doc-selector',
  templateUrl: './doc-selector.component.html',
  styleUrls: ['./doc-selector.component.scss']
})
export class DocSelectorComponent implements OnInit {
  documents: any;
  selectedDocument: any;
  haveAccess: boolean = false;

  constructor(private queryService: QueryService, private docEditorService: DocEditorService, private appStateService: AppStateService) {
  }

  async ngOnInit() {
    const loggedInUser = this.appStateService.loggedInUser;
    this.queryService.getDocuments().pipe(take(1)).subscribe((data) => {
      this.documents = data;
      this.selectedDocument = this.documents[0];
      if (this.selectedDocument.sharedWith.includes(loggedInUser.email) || this.selectedDocument.owner.email === loggedInUser.email) {
        this.haveAccess = true;
        this.docEditorService.selectedDocument = this.selectedDocument;
        this.docEditorService.joinDocument(this.selectedDocument['_id']);
      } else {
        console.log('You do not have access to this document');
        this.haveAccess = false;
      }
    });

  }

}
