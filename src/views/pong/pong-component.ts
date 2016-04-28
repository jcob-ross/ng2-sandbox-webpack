import { Component, OnInit, OnDestroy } from 'angular2/core';
import { PongGame } from "./PongGame/PongGame";

let styles = require('!raw!postcss-loader!sass!./pong-component.scss');
let template = require('./pong-component.html');

@Component({
  selector: 'pong',
  styles: [ styles ],
  template: template
})
export class PongComponent implements OnInit, OnDestroy {
  private _bodyBgColor: string;
  private game: PongGame;
  public scorePlayer: number;
  public scoreAi: number;
  public state: string;

  ngOnInit() {
    this._bodyBgColor = document.getElementsByTagName('body').item(0).style.backgroundColor;
    document.getElementsByTagName('body').item(0).style.backgroundColor = '#0C0C0C';

    this.scorePlayer = 0;
    this.scoreAi = 0;
    this.game = new PongGame(640, 480, 'canvas-wrapper');
    this.game.init( (side: "player"|"ai") => { this.onGoalScored(side); },
      (state: "running"|"paused") => { this.onGamePaused(state) },
      () => { this.onGameReset(); });
    this.game.run();
  }

  ngOnDestroy() {
    document.getElementsByTagName('body').item(0).style.backgroundColor = this._bodyBgColor;
  }

  private onGameReset() {
    this.scoreAi = 0;
    this.scorePlayer = 0;
    this.state = '';
  }

  private onGamePaused(state: "running"|"paused") {
    this.state = state;
  }

  private onGoalScored(side: "player"|"ai") {
    if (side == "player") this.scorePlayer += 1;
    if (side == "ai") this.scoreAi += 1;
  }
}
