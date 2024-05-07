import {Injectable, signal} from '@angular/core';
import  { io }  from 'socket.io-client';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DocEditorService {
  private socket = io('http://localhost:8080/document');
  selectedDocument!: any;
  selectedContent$ = new Subject();

  constructor() {
    this.socket.off('documentUpdated').on('documentUpdated', (data) => {
      console.log('DATA, documentUpdated', data)
      this.setSelectedDocContent(data.content);
      // Update your document content based on the received data
      // For example, if you're using React, you might update the state here
    });
  }

  joinDocument(id: any) {
    const roomName = `document_${id}`; // Construct room name based on document ID
    this.socket.emit('joinDocument', roomName);
  }

  setSelectedDocContent(content: any) {
      this.selectedContent$.next(content);
  }

  getSelectedDocLatestContent() {
    return this.selectedContent$.asObservable();
  }

}
