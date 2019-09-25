import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GameService } from './game.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { GameComponent } from './game/game.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    GameComponent,
    CodeEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
