import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from 'angular2/core';
import {ThreadsService} from '../services';
import {Observable} from 'rxjs';
import {Thread} from '../models';

@Component({
  inputs: ['thread'],
  selector: 'chat-thread',
  template: `
  <div class="media conversation">
    <div class="media-body">
      <h5 class="media-heading contact-name">{{thread.name}}
        <span *ngIf="selected">&bull;</span>
      </h5>
      <small class="message-preview">{{thread.lastMessage.body}}</small>
    </div>
    <a (click)="clicked($event)" class="div-link">Select</a>
  </div>
  `
})
class ChatThread implements OnInit {
  thread: Thread;
  selected: boolean = false;

  constructor(public threadsService: ThreadsService) {
  }

  ngOnInit(): void {
    this.threadsService.currentThread
      .subscribe( (currentThread: Thread) => {
        this.selected = currentThread &&
          this.thread &&
          (currentThread.id === this.thread.id);
      });
  }

  clicked(event: any): void {
    this.threadsService.setCurrentThread(this.thread);
    event.preventDefault();
  }
}


@Component({
  selector: 'chat-threads',
  directives: [ChatThread],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row">
      <div class="conversation-wrap">

        <chat-thread
             *ngFor="#thread of threads | async"
             [thread]="thread">
        </chat-thread>

      </div>
    </div>
  `
})
export class ChatThreads {
  threads: Observable<any>;
  constructor(public threadsService: ThreadsService) {
    this.threads = threadsService.orderedThreads;
  }
}
