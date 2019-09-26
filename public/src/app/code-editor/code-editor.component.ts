import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { GameService } from '../game.service';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {
  @Input() game_instance: any;
  @Input() current_question: any;
  @Input() question_number: any;
  @ViewChild('editor', {static: false}) editor;
  //For Sam's code: message will contain the code that the users are sending
  message : String = '';
  rem_guesses : Number = 3;
  gameEnd : Boolean = false;
  game_text : String = `You have ${this.rem_guesses} attempts remaining!`
  constructor(
    private gameService: GameService,
    private _httpService: HttpService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.gameService
      .getMessages()
      .subscribe((message: string) => {
        this.message = message;
      });
    this.gameService
      .get_remaining_attempts()
      .subscribe((attempts: Number) => {
        this.rem_guesses = attempts;
        if (this.rem_guesses == 0) {
          this.gameEnd = true;
        }
      });
  }
  
  ngAfterViewInit() {
    //this.editor.theme = "eclipse";
    this.editor.mode = 'javascript';
    this.editor.getEditor().setOptions({
        enableBasicAutocompletion: true,
        showLineNumbers: true,
        tabSize: 4
    });
  }

  sendMessage() {
    this.gameService.sendMessage(this.message);
  }

  checkAnswer() {
    var catdoodle = this.message;
    console.log("inputted script below");
    console.log(catdoodle);
    console.log("Game instance: ", this.game_instance)

    var data = {
      script: catdoodle,
      question_name: this.current_question.name,
      game_id: this.game_instance['_id']
    }

    console.log(data)
    let observable = this._httpService.check_submission(data)
    observable.subscribe((data)=>{
      console.log("from express server!", data);
      this.rem_guesses = (3 - parseInt(data['game']['turns'], 10));
      //Check if user got right, if so, then send the rem_guesses, the game_text to be "yay!" and gameEnd to true

      //Check if user is out of attempts, if so, then send the rem_guesses, the game_text to be "no :(" and gameEnd to true
      if (this.rem_guesses == 0) {
        this.gameEnd = true;
        this.game_text = "You are out of attempts :("
        this.gameService.changeAttempts({'rem_attempts': this.rem_guesses,
          'game_text' : `You have ${this.rem_guesses} attempts remaining!`,
          'game_end' : false});
      }
      //Otherwise just change the rem_guesses, the game text to print that they got it incorrect and the remaining guesses 
      //and leave gameEnd as false
      else {
      //Below this... add the error message that came back from the API
        this.game_text = `You have ${this.rem_guesses} attempts remaining!`
        this.gameService.changeAttempts({'rem_attempts': this.rem_guesses,
          'game_text' : `You have ${this.rem_guesses} attempts remaining!`,
          'game_end' : false});
      }
    })
  }

}
