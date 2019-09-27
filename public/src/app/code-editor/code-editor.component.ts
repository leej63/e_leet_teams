import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { GameService } from '../game.service';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { delay } from 'q';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {
  @Input() game_instance: any;
  @Input() current_question: any;
  @Input() question_number: number;
  @ViewChild('editor', {static: false}) editor;

  message : String = '';
  rem_guesses = 3;
  gameEnd : Boolean = false;
  gameStart: Boolean = false;
  error_message : String = "";
  seconds = 0;
  minutes = 25;
  counter = 1500;
  game_text : String = `You have ${this.rem_guesses} attempt(s) remaining!`
  constructor(
    private gameService: GameService,
    private _httpService: HttpService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.current_question = this.gameService.get_current_question();
    console.log(`This is from the code-editor`);
    console.log(this.current_question);
    this.message = this.gameService.getMessage();
    this.rem_guesses = this.gameService.getRemGuesses();
    //this.gameEnd = this.gameService.getgameEnd();
    this.error_message = this.gameService.getErrorMessage();
    this.seconds = this.gameService.getSeconds();
    this.minutes = this.gameService.getMinutes();
    this.counter = this.gameService.getCounter();
    this.game_text = this.gameService.getGameText();

    this.gameService
      .getMessages()
      .subscribe((message: string) => {
        this.message = message;
        this.gameService.setMessage(message);
      });
    this.gameService
      .get_remaining_attempts()
      .subscribe((attempts) => {
        this.rem_guesses = attempts['rem_attempts'];
        this.gameEnd = attempts['game_end'];
        this.game_text = attempts['game_text'];
        this.error_message = attempts['error_message'];
        this.gameService.setRemGuesses(attempts['rem_attempts']);
        this.gameService.setgameEnd(attempts['rem_attempts']);;
        this.gameService.setGameText(attempts['game_text']);
        this.gameService.setErrorMessage(attempts['error_message']);
        if (this.rem_guesses == 0) {
          this.gameEnd = true;
        }
      });
    this.gameService
      .beginGame()
      .subscribe((data)=> {
        this.gameStart = true;
        this.gameService.setgameStart(true);
        this.countdownTimer();
      })

    this.gameService 
      .begin_new_game()
      .subscribe((data) => {
        if('current_question' in data) {
          this.current_question = data['current_question'];
          this.gameService.set_current_question(data['current_question']);
          this.game_instance = data['game_instance'];
          this.gameService.set_game_instance(data['game_instance']);
          this.question_number = data['number']
          this.gameService.set_question_number(data['number']);
        }
        this.seconds = data['seconds'];
        this.minutes = data['minutes'];
        this.counter = data['counter'];
        this.gameService.setSeconds(data['seconds']);
        this.gameService.setMinutes(data['minutes']);
        this.gameService.setCounter(data['counter']);
        this.countdownTimer();
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
    console.log('this is the question numbers');
    console.log(this.question_number)
    this.question_number += 1;
    this.current_question = this.game_instance.questions[this.question_number];
    this.gameService.set_current_question(this.current_question);
    this.message = "Start Coding!";
    this.rem_guesses = 3;
    this.game_text = `You have ${this.rem_guesses} attempt(s) remaining!`;
    this.gameEnd = false;
    this.gameService.setgameEnd(false);
    this.seconds = 0;
    this.minutes = 25;
    this.counter = 1500;
    this.sendMessage();
    this.countdownTimer();
    this.gameService.newGame({
      'current_question' : this.current_question,
      'game_instance' : this.game_instance,
      'number' : this.question_number,
      'seconds' : this.seconds,
      'minutes' : this.minutes,
      'counter' : this.counter
    })
    this.gameService.changeAttempts({'rem_attempts': this.rem_guesses,
      'game_text' : `You have ${this.rem_guesses} attempt(s) remaining!`,
      'game_end' : false,
      'error_message' : ""});
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

  async countdownTimer() {
    for (let i = 1500; i > 0; i--){
      await delay(1000);
      this.counter = this.counter -1;
      this.gameService.setCounter(this.counter);
      // console.log(this.counter)
      if(this.counter == -1){
        this.gameEnd = true;
        this.game_text = 'You ran out of time, try again!';
        this.error_message = '';
        return
      }
      if(this.seconds == 0){
        this.seconds = 59;
        this.gameService.setSeconds(59);
        this.minutes = this.minutes - 1;
        this.gameService.setMinutes(this.minutes);
      }
      else{
        this.seconds = this.seconds - 1;
        this.gameService.setSeconds(this.seconds);
      }
    }
  }

  startGame () {
    this.gameStart = true;
    this.gameService.startGame();
    this.countdownTimer();
  }

}
