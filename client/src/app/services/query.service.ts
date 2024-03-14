import { Injectable } from '@angular/core';
import {Apollo} from "apollo-angular";
import {GET_DOCUMENTS} from "../models/query.model";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private apollo: Apollo) { }

  getDocuments() {
    return this.apollo.watchQuery({
        query: GET_DOCUMENTS,
      })
      .valueChanges.pipe(map((result: any) => result.data && result.data?.documents));
  }
}
