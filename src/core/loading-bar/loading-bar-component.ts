import {Component, Input} from 'angular2/core';
import {isPresent} from 'angular2/src/facade/lang';
import {LoadingBarService, LoadingBarEvent, LoadingBarEventType} from './loading-bar-service';

/**
 * Loading bar for tracking async progress.
 */
@Component({
  selector: 'loading-bar',
  template: `
    <div class="loading-bar">
        <div class="loading-bar-progress" [style.width]="progress" [style.backgroundColor]="color" [style.color]="color"
            [style.height]="height" [style.opacity]="show ? '1' : '0'">
          <div class="loading-bar-peg">
        </div>
    </div>
  `
})
export class LoadingBar {
  private progressElement:HTMLDivElement;
  @Input() color: string = '#00AFFF';
  @Input() height: string = '2px';
  @Input() show: boolean = true;

  constructor(private service:LoadingBarService) {}

  private _progress: string = '0%';
  @Input() set progress(value: string) {
    if (isPresent(value)) {
      this._progress = value + '%';
    }
  }

  get progress(): string {
    return this._progress;
  }

  ngOnInit(): any {
    this.service.observable.subscribe((event:LoadingBarEvent) => {
      if (event.type === LoadingBarEventType.Progress) {
        this.progress = event.value;
      } else if (event.type === LoadingBarEventType.Visible) {
        this.show = event.value;
      } else if (event.type === LoadingBarEventType.Color) {
        this.color = event.value;
      } else if (event.type === LoadingBarEventType.Height) {
        this.height = event.value;
      }
    });
  }
}