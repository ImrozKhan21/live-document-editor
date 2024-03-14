import {Component, OnInit} from '@angular/core';
import {RestApiService} from "./services/rest-api.service";
import {Observable} from "rxjs";
import {AppStateService} from "./services/app-state.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'real-time-doc-editor-client';
  loggedIn$: Observable<boolean> | undefined;

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit() {
    this.loggedIn$ = this.appStateService.getLoggedIn();

  }

}
