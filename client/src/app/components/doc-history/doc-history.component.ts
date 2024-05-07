import {Component, Input, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {PanelModule} from "primeng/panel";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IHistory} from "../../models/typesAndInterfaces";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-doc-history',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    ButtonModule,
    PanelModule,
    DatePipe
  ],
  templateUrl: './doc-history.component.html',
  styleUrl: './doc-history.component.scss'
})
export class DocHistoryComponent implements OnInit {
  @Input() document: any;
  docHistory: IHistory[];


  ngOnInit() {
    this.docHistory = this.document.history;
    console.log('Document History', this.docHistory);
  }

  revertToVersion(version: IHistory) {
    console.log('Reverting to version', version);
  }
}
