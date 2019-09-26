import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  name = "";
  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private router: Router, private gameService: GameService) { }

  ngOnInit() {
  }

  setName() {
    console.log(this.name)
    this.gameService.setName(this.name);
    this.router.navigate(['/game_page']);
  }
}
