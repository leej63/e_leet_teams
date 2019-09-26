import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket;  
  constructor() {
    this.socket = io();
   }

   public sendMessage(message) {
    this.socket.emit('message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('new-message', (message) => {
            observer.next(message);
        });
    });
  }

  public send_New_Message(message) {
    this.socket.emit('create-message', message);
  }

  public addMessage = () => {
    return Observable.create((observer) => {
        this.socket.on('add-message', (message) => {
            observer.next(message);
        });
    });
  }

  public changeAttempts(num_attempts) {
    this.socket.emit('change_guesses', num_attempts);
  }

  public get_remaining_attempts = () => {
    return Observable.create((observer) => {
      this.socket.on('decrement_guesses', (attempts) => {
          observer.next(attempts);
      });
    });
  }

}
