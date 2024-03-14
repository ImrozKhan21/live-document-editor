import {Component, OnInit} from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";
import {AppStateService} from "../../services/app-state.service";
import {Observable, take} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        AsyncPipe,
        ButtonModule
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  loggedIn$!: Observable<boolean>;
  userData: any;

  constructor(private restApiService: RestApiService, private appStateService: AppStateService) {
  }

  ngOnInit() {
    this.loggedIn$ = this.appStateService.getLoggedIn();
    this.restApiService.checkIfLoggedIn().subscribe({
      next: (data: any) => {
        this.userData = data.user;
        this.appStateService.loggedInUser = this.userData;
        console.log("data", data);
        this.appStateService.setLoggedIn(true);
      }
    })
  }


  login() {
    this.restApiService.login();
  }


  logout() {
    this.restApiService.logout().pipe(take(1)).subscribe({
      next: (data: any) => {
        if (!data.loggedIn) {
          this.appStateService.setLoggedIn(false);
        }
      }
    });
  }
}
