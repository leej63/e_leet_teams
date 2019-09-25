import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

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
}
