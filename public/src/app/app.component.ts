import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'public';

  constructor(private _httpService: HttpService, private gameService: GameService,) { }

  ngOnInit() {
    this.gameService
      .getMessages()
      .subscribe((message: string) => {
        this.gameService.setMessage(message);
      });
    this.gameService
      .get_remaining_attempts()
      .subscribe((attempts) => {
        this.gameService.setRemGuesses(attempts['rem_attempts']);
        this.gameService.setgameEnd(attempts['rem_attempts']);;
        this.gameService.setGameText(attempts['game_text']);
        this.gameService.setErrorMessage(attempts['error_message']);
        if (this.gameService.getRemGuesses() == 0) {
          this.gameService.setgameEnd(true);
        }
      });
    this.gameService
      .beginGame()
      .subscribe((data)=> {
        console.log("this is from the begingame in the app component")
        console.log(data);
        this.gameService.setgameStart(true);
      })

    this.gameService 
      .begin_new_game()
      .subscribe((data) => {
        console.log("This is from the beging_new_game app component");
        console.log(data);
        this.gameService.set_current_question(data['current_question']);
        this.gameService.set_question_number(parseInt(data['number']));
        this.gameService.set_game_instance(data['game_instance']);
        this.gameService.setSeconds(parseInt(data['seconds'], 10));
        this.gameService.setMinutes(parseInt(data['minutes'], 10));
        this.gameService.setCounter(parseInt(data['counter'], 10));
      });
  }
}
