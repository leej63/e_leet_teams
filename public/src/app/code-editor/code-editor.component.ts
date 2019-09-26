import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {
  @ViewChild('editor', {static: false}) editor;
  //For Sam's code: message will contain the code that the users are sending
  message : String = '';
  constructor(private gameService: GameService) { }

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
    var catdoodle = JSON.stringify(this.message);
    console.log(catdoodle);
  }

}
