import {Observable, Subscriber} from 'rxjs';
import {Injectable} from 'angular2/core';
import {isPresent} from 'angular2/src/facade/lang';

export enum LoadingBarEventType { Visible, Progress, Height, Color }
export class LoadingBarEvent {
  constructor(public type:LoadingBarEventType, public value:any) {}
}


@Injectable()
export class LoadingBarService {

  private subscriber: Subscriber<LoadingBarEvent>;
  private _intervalCounterId: any = 0;
  private _visible: boolean = true;
  private _progress: number = 0;
  private _height: string = '2px';
  private _color: string = '#00AFFF';

  public intervalMs: number = 500;
  public observable: Observable<LoadingBarEvent>;

  constructor() {
    this.observable = new Observable<LoadingBarEvent>((subscriber: Subscriber<LoadingBarEvent>) => {
      this.subscriber = subscriber;
    });
  }

  set progress(value: number) {
    if (isPresent(value)) {
      if (value > 0) {
        this.visible = true;
      }
      this._progress = value;
      this.emitEvent(new LoadingBarEvent(LoadingBarEventType.Progress, this._progress));
    }
  }

  get progress(): number {
    return this._progress;
  }


  set height(value: string) {
    if (isPresent(value)) {
      this._height = value;
      this.emitEvent(new LoadingBarEvent(LoadingBarEventType.Height, this._height));
    }
  }

  get height(): string {
    return this._height;
  }

  set color(value: string) {
    if (isPresent(value)) {
      this._color = value;
      this.emitEvent(new LoadingBarEvent(LoadingBarEventType.Color, this._color));
    }
  }

  get color(): string {
    return this._color;
  }

  set visible(value: boolean) {
    if (isPresent(value)) {
      this._visible = value;
      this.emitEvent(new LoadingBarEvent(LoadingBarEventType.Visible, this._visible));
    }
  }

  get isVisible(): boolean {
    return this._visible;
  }

  private emitEvent(event: LoadingBarEvent) {
    try {
      this.subscriber.next(event);
    } catch (e) {
      console.log(e);
      console.log('Is there <loading-bar></loading-bar> in your markup?');
    }
  }


  start(onCompleted: Function = null) {
    this.stop();
    this.visible = true;
    this._intervalCounterId = setInterval(() => {
      this.progress++;
      if (this.progress === 100) {
        this.complete();
      }
    }, this.intervalMs);
  }

  reset() {
    this.stop();
    this.progress = 0;
  }

  stop() {
    if (this._intervalCounterId) {
      clearInterval(this._intervalCounterId);
      this._intervalCounterId = null;
    }
  }

  private _oldColor: string;
  complete() {
    this.progress = 100;
    this.stop();
    setTimeout(() => {
      this.visible = false;
      setTimeout(() => {
        this.progress = 0;
        this.color = this._oldColor;
      }, 333);
    }, 333);
  }

  fail() {
    this._oldColor = this.color;
    this.color = 'red';
    this.complete();
  }
}