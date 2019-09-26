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
  rem_guesses = 3;
  gameEnd : Boolean = false;
  error_message : String = "";
  game_text : String = `You have ${this.rem_guesses} attempt(s) remaining!`
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
      .subscribe((attempts) => {
        console.log(attempts);
        this.rem_guesses = attempts['rem_attempts'];
        this.gameEnd = attempts['game_end'];
        this.game_text = attempts['game_text'];
        this.error_message = attempts['error_message']
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

  newGame() {
    this.message = "";
    this.rem_guesses = 3;
    this.game_text = `You have ${this.rem_guesses} attempt(s) remaining!`;
    this.gameEnd = false;
    this.sendMessage();
    this.gameService.changeAttempts({'rem_attempts': this.rem_guesses,
      'game_text' : this.game_text,
      'game_end' : false,
      'error_message' : ""});
    //******************************************************************* */
    //@Sam - add stuff here to grab a new question and grab the new text, etc
    //******************************************************************* */
  }

  checkAnswer() {
    var catdoodle = this.message;
    var data = {
      script: catdoodle,
      question_name: this.current_question.name,
      game_id: this.game_instance['_id']
    }
    let observable = this._httpService.check_submission(data)
    observable.subscribe((data)=>{
      console.log("from express server!", data);
      this.rem_guesses = this.rem_guesses - 1;
      //Check if user got right, if so, then send the rem_guesses, the game_text to be "yay!" and gameEnd to true
      if(data['jdoodle']['message'] == 'Correct!') {
        this.gameEnd = true;
        this.game_text = "Correct!"
        this.error_message = "";
        this.gameService.changeAttempts({'rem_attempts': this.rem_guesses,
          'game_text' : "Correct!",
          'game_end' : true,
          'error_message' : ""});
      }
      //Check if user is out of attempts, if so, then send the rem_guesses, the game_text to be "no :(" and gameEnd to true
      else if (this.rem_guesses == 0) {
        this.gameEnd = true;
        this.game_text = "You are out of attempts :("
        this.gameService.changeAttempts({'rem_attempts': this.rem_guesses,
          'game_text' : "You are out of attempts :(",
          'game_end' : true,
          'error_message' : ""});
      }
      //Otherwise just change the rem_guesses, the game text to print that they got it incorrect and the remaining guesses 
      //and leave gameEnd as false
      else {
        this.error_message = `Incorrect output: ${data['jdoodle']['output']}`
        this.game_text = `You have ${this.rem_guesses} attempt(s) remaining!`
        this.gameService.changeAttempts({'rem_attempts': this.rem_guesses,
          'game_text' : `You have ${this.rem_guesses} attempt(s) remaining!`,
          'game_end' : false,
          'error_message' : `Incorrect output: ${data['jdoodle']['output']}`});
      }
    })
  }

}
