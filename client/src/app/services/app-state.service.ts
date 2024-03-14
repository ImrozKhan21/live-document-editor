import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  isLoggedIn$ = new Subject<boolean>();
  loggedInUser: any;

  constructor() { }

  setLoggedIn(value: boolean) {
    this.isLoggedIn$.next(value);
  }

  getLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }
}
