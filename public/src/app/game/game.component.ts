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
  question_number: number = 0;
  current_question: any;
  name = "";
  message = '';
  messages = [];

  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private router: Router , private gameService: GameService) { }
  ngOnInit() {
    if(this.gameService.getName() == "")
      this.router.navigate(['/']);
    this.game_instance = {
      questions: [],
      turns: 0,
      message: '',
    }
    if (!this.gameService.get_game_instance()) {
      let observable = this._httpService.new_game_instance();
      observable.subscribe((data)=>{
        this.game_instance = data
        console.log('game_instance: ', this.game_instance)
        this.current_question = this.game_instance.questions[this.question_number]
        console.log('current_question: ', this.current_question)
      })
    }
    else {
      this.game_instance = this.gameService.get_game_instance();
      this.current_question = this.gameService.get_current_question();
      this.question_number = this.gameService.get_question_number();
    }

    this.gameService
      .addMessage()
      .subscribe((message: string) => {
        this.messages.push(message);
      });

    this.name = this.gameService.getName();
    this.gameService.send_New_Message(`${this.name} has joined!`);
    this.messages.push(`${this.name} has joined!`);
  }

  sendMessage() {
    var new_msg = `${this.name}: ${this.message}`
    this.gameService.send_New_Message(new_msg);
    this.messages.push(new_msg);
    this.message = '';
  }

}
