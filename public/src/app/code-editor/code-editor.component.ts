import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {
  //For Sam's code: message will contain the code that the users are sending
  message : String;
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService
      .getMessages()
      .subscribe((message: string) => {
        this.message = message;
      });
  }
  
  sendMessage() {
    this.gameService.sendMessage(this.message);
  }

  checkAnswer() {
    console.log(JSON.stringify(this.message));
  }

}
