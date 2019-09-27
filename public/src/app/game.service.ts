import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket;  
  private name = "";
  constructor() {
    this.socket = io();
   }

   public sendMessage(message) {
    this.socket.emit('message', message);
  }

  public setName(name) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public getMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('new-message', (message) => {
            observer.next(message);
        });
    });
  }

  public startGame() {
    this.socket.emit('start_game', true);
  }

  public beginGame = () => {
    return Observable.create((observer) => {
      this.socket.on('begin_game', () => {
          observer.next(true);
      });
  });
  }

  public send_New_Message(message) {
    this.socket.emit('create-message', message);
  }

  public newGame(data) {
    this.socket.emit('new_game', data);
  }

  public begin_new_game = () => {
    return Observable.create((observer) => {
      this.socket.on('initate_new_game', (data) => {
          observer.next(data);
      });
    });
  }

  public addMessage = () => {
    return Observable.create((observer) => {
        this.socket.on('add-message', (message) => {
            observer.next(message);
        });
    });
  }

  public changeAttempts(attempt_dict) {
    this.socket.emit('change_guesses', attempt_dict);
  }

  public get_remaining_attempts = () => {
    return Observable.create((observer) => {
      this.socket.on('decrement_guesses', (attempts) => {
          observer.next(attempts);
      });
    });
  }

}
