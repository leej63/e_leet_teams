import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GameService } from '../game.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  message = '';
  messages = [];

  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router , private gameService: GameService) { }
  ngOnInit() {

    this.gameService
      .addMessage()
      .subscribe((message: string) => {
        this.messages.push(message);
      });


  }

  sendMessage() {
    this.gameService.send_New_Message(this.message);
    this.messages.push(this.message);
    this.message = '';
  }

  
}
