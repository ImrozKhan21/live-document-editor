import {Component, OnInit} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {MutationService} from "../../services/mutation.service";
import {PanelModule} from "primeng/panel";
import {DocEditorService} from "../../services/doc-editor.service";

@Component({
  selector: 'app-share-doc',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    ButtonModule,
    PanelModule
  ],
  templateUrl: './share-doc.component.html',
  styleUrl: './share-doc.component.scss'
})
export class ShareDocComponent implements OnInit {

  currentEmail: string = '';
  emailsWithDocsShared: string[] = [];
  currentDocumentDetails: any;
  userEmailsWithDocsShared: string[] = [];

  constructor(private mutationService: MutationService, private docEditorService: DocEditorService) {
  }

  ngOnInit() {
    this.currentDocumentDetails = this.docEditorService.selectedDocument;
    this.userEmailsWithDocsShared = this.currentDocumentDetails?.sharedWith.filter((email: string) => email) || [];
    console.log('111 this.docEditorService.selectedDocument', this.docEditorService.selectedDocument);
  }

  async addEmailToShareList() {
    this.emailsWithDocsShared.push(this.currentEmail);
    console.log('Email added to share list: ', this.currentEmail, this.emailsWithDocsShared);
    await this.mutationService.sharedDoc(this.emailsWithDocsShared);
  }

  async removeEmailFromShareList(email: string) {

  }

}
