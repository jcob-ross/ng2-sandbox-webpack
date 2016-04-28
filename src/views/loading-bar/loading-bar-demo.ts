import { Component, ViewEncapsulation } from 'angular2/core';
import { LoadingBarService } from '../../core/loading-bar';

/**
 * Loading bar tag is in app component's template
 */
// todo(jcob): loading-bar - tests, http request interceptor for ng2
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'loading-bar-demo',
  template: `
<div class="container text-center">
    <br />
<div class="row" style="margin-top: 110px;">
<div class="btn-group-vertical" role="group">
    <button class="btn btn-default" (click)="setProgress(40)">Set progress at 40%</button><br />
    <button class="btn btn-default" (click)="incrementProgress(5)">Increment progress</button><br />
    <button class="btn btn-default" (click)="startProgress()">Start progress</button><br />
    <button class="btn btn-default" (click)="completeProgress()">Complete progress</button><br />
    <button class="btn btn-default" (click)="stopProgress()">Stop progress</button><br />
    <button class="btn btn-default" (click)="resetProgress()">Reset progress</button><br /><br />
    <button class="btn btn-default" (click)="failProgress()">Fail progress</button><br />
</div>
    
</div>
</div>`,
  styles: [`
  .loading-bar {
    pointer-events: none;
    z-index: 9999;
    position: relative;
    height: 0;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
  }
  .loading-bar-progress {
    pointer-events: none;
    position: absolute;
    margin: 0;
    padding: 0;
    z-index: 9998;
    background-color: green;
    color: green;
    box-shadow: 0 0 10px 0;
    height: 2px;
    opacity: 0;

    -webkit-transition: all 350ms linear;
    -moz-transition: all 350ms linear;
    -o-transition: all 350ms linear;
    transition: all 350ms linear;
  }
  .loading-bar-peg {
    pointer-events: none;
    position: absolute;
    width: 60px;
    right: 0;
    top: 0;
    height: 2px;
    opacity: .75;
    -moz-box-shadow: #29d 1px 0 6px 1px;
    -ms-box-shadow: #29d 1px 0 6px 1px;
    -webkit-box-shadow: #29d 1px 0 6px 1px;
    box-shadow: #29d 1px 0 8px 1px;
    -moz-border-radius: 100%;
    -webkit-border-radius: 100%;
    border-radius: 100%;
  }
  `]
})
export class LoadingBarComponent {

  constructor(private _slimLoader: LoadingBarService) {}

  setProgress(num: number) {
    this._slimLoader.progress = num;
  }

  startProgress() {
    this._slimLoader.start();
  }

  completeProgress() {
    this._slimLoader.complete();
  }

  failProgress() {
    this._slimLoader.fail();
  }

  stopProgress() {
    this._slimLoader.stop();
  }

  resetProgress() {
    this._slimLoader.reset();
  }

  incrementProgress(num: number) {
    this._slimLoader.progress += num;
  }

  setBarHeight(num: number) {
    this._slimLoader.height = +num +'px';
  }

}