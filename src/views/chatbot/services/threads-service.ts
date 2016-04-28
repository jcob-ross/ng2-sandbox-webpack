import {Injectable, bind} from 'angular2/core';
import {Subject, BehaviorSubject, Observable} from 'rxjs';
import {Thread, Message} from '../models';
import {MessagesService} from './messages-service';
import * as _ from 'lodash';

@Injectable()
export class ThreadsService {

  /**
   * Most up to date list of threads
   */
  threads: Observable<{ [key: string]: Thread }>;

  /**
   * Chronologically ordered threads
   */
  orderedThreads: Observable<Thread[]>;

  /**
   * Currently selected thread
   * @type {BehaviorSubject<Thread>}
   */
  currentThread: Subject<Thread> =
    new BehaviorSubject<Thread>(new Thread());

  /**
   * Messages of the currently selected thread
   */
  currentThreadMessages: Observable<Message[]>;

  constructor(public messagesService: MessagesService) {

    this.threads = messagesService.messages
      .map( (messages: Message[]) => {
        let threads: {[key: string]: Thread} = {};
        // Store the message's thread in our accumulator `threads`
        messages.map((message: Message) => {
          threads[message.thread.id] = threads[message.thread.id] ||
            message.thread;

          // Cache the most recent message for each thread
          let messagesThread: Thread = threads[message.thread.id];
          if (!messagesThread.lastMessage ||
            messagesThread.lastMessage.sentAt < message.sentAt) {
            messagesThread.lastMessage = message;
          }
        });
        return threads;
      });

    this.orderedThreads = this.threads
      .map((threadGroups: { [key: string]: Thread }) => {
        let threads: Thread[] = <Thread[]>_.values(threadGroups);
        return _.sortBy(threads, (t: Thread) => t.lastMessage.sentAt).reverse();
      });

    this.currentThreadMessages = this.currentThread
      .combineLatest(messagesService.messages,
        (currentThread: Thread, messages: Message[]) => {
          if (currentThread && messages.length > 0) {
            return _.chain(messages)
              .filter((message: Message) =>
                (message.thread.id === currentThread.id))
              .map((message: Message) => {
                message.isRead = true;
                return message; })
              .value();
          } else {
            return [];
          }
        });

    this.currentThread.subscribe(this.messagesService.markThreadAsRead);
  }

  setCurrentThread(newThread: Thread): void {
    this.currentThread.next(newThread);
  }

}

export var threadsServiceInjectables: Array<any> = [
  bind(ThreadsService).toClass(ThreadsService)
];
