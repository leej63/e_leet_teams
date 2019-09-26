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
  game_instance: any;
  question_number = 0;
  current_question: any;

  message = '';
  messages = [];

  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router , private gameService: GameService) { }
  ngOnInit() {
    this.game_instance = {
      questions: [],
      turns: 0,
      message: '',
    }
    let observable = this._httpService.new_game_instance();
    observable.subscribe((data)=>{
      this.game_instance = data
      console.log('game_instance: ', this.game_instance)
      this.current_question = this.game_instance.questions[this.question_number]
      console.log('current_question: ', this.current_question)
    })

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
