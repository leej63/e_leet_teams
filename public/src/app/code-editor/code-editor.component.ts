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
      console.log("from express server!", data)
      if (data['game']['turns'] == 4){
        console.log("NO MORE GAME!")
      }
    })
  }

}
