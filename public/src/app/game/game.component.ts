import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GameService } from '../game.service';
import { delay } from 'q';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  message = '';
  messages = [];
  seconds = 0;
  minutes = 25;
  counter = 1500;

  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router , private gameService: GameService) { }
  ngOnInit() {
    this.countdownTimer();

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

  async countdownTimer() {
    for (let i = 1500; i > 0; i--){
      await delay(1000);
      this.counter = this.counter -1;
      // console.log(this.counter)
      if(this.counter == 0){
        this._router.navigate(['/']);                       // PLACEHOLDER - need to have redirect to win or loss page
        return
      }
      if(this.seconds == 0){
        this.seconds = 59;
        this.minutes = this.minutes - 1;
      }
      else{
        this.seconds = this.seconds - 1;
      }
    }
  }

}
