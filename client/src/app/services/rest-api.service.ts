import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";


const uri = 'http://localhost:8080'; // <-- add the URL of the GraphQL server here

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HttpClient) { }

  login() {
    const url = `${uri}/login`;
    window.location.href = url;
  }

  logout() {
    const url = `${uri}/logout`;
    return this.http.get(url, { withCredentials: true });
  }

  checkIfLoggedIn() {
    const url = `${uri}/check-session`;
    return this.http.get(url, { withCredentials: true });
  }
}
