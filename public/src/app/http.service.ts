import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private _http: HttpClient) { }
  check_submission(data){
    return this._http.post('/game/check', data)
  }
  new_game_instance(){
    return this._http.get('/game')
  }
}
