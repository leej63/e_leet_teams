import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket;  
  private name = "";
  game_instance : any;
  current_question: any;
  question_number: number = 0;
  message : String = '';
  rem_guesses = 3;
  gameEnd : Boolean = false;
  gameStart: Boolean = false;
  error_message : String = "";
  seconds = 0;
  minutes = 25;
  counter = 1500;
  game_text : String = `You have ${this.rem_guesses} attempt(s) remaining!`


  constructor() {
    this.socket = io();
   }

  public get_game_instance() {
    return this.game_instance;
  }

  public set_game_instance(instance) {
    this.game_instance = instance;
  }

  public set_question_number(num) {
    this.question_number = num;
  }

  public get_question_number() {
    return this.question_number;
  }

  public get_current_question() {
    return this.current_question;
  }

  public set_current_question(data) {
    this.current_question = data;
  }
  public getMessage() {
    return this.message;
  }

  public setMessage(message) {
    this.message = message;
  }

  public setRemGuesses(guesses) {
    this.rem_guesses = guesses;
  }

  public getRemGuesses() {
    return this.rem_guesses;
  }
  
  public getgameEnd() {
    return this.gameEnd;
  }

  public setgameEnd(isEnd) {
    this.gameEnd = isEnd;
  }

  public getgameStart() {
    return this.gameStart;
  }

  public setgameStart(isStart) {
    this.gameStart = isStart;
  }
  
  public getErrorMessage(){
    return this.error_message;
  }
  
  public setErrorMessage(message) {
    this.error_message = message;
  }

  public setSeconds(seconds) {
    this.seconds = seconds;
  }

  public getSeconds() {
    return this.seconds;
  }
  public getMinutes() {
    return this.minutes;
  }

  public setMinutes(minutes) {
    this.minutes = minutes;
  }

  public setCounter(counter) {
    this.counter = counter;
  }

  public getCounter() {
    return this.counter;
  }
  
  public setGameText(text) {
    this.game_text = text;
  }

  public getGameText() {
    return this.game_text;
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
