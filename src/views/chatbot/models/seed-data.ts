/* tslint:disable:max-line-length */
import {User, Thread, Message} from '.';
import {MessagesService, ThreadsService,
  UserService} from '../services';
import * as moment from 'moment';

// the person using the app us Juliet
let me: User      = new User('Juliet');
let ladycap: User = new User('Lady Capulet');
let echo: User    = new User('Echo Bot');
let rev: User     = new User('Reverse Bot');
let wait: User    = new User('Waiting Bot');

let tLadycap: Thread = new Thread('tLadycap', ladycap.name);
let tEcho: Thread    = new Thread('tEcho', echo.name);
let tRev: Thread     = new Thread('tRev', rev.name);
let tWait: Thread    = new Thread('tWait', wait.name);

let initialMessages: Array<Message> = [
  new Message({
    author: me,
    sentAt: moment().subtract(45, 'minutes').toLocaleString(),
    body: 'Yet let me weep for such a feeling loss.',
    thread: tLadycap
  }),
  new Message({
    author: ladycap,
    sentAt: moment().subtract(20, 'minutes').toLocaleString(),
    body: 'So shall you feel the loss, but not the friend which you weep for.',
    thread: tLadycap
  }),
  new Message({
    author: echo,
    sentAt: moment().subtract(1, 'minutes').toLocaleString(),
    body: `I\'ll echo whatever you send me`,
    thread: tEcho
  }),
  new Message({
    author: rev,
    sentAt: moment().subtract(3, 'minutes').toLocaleString(),
    body: `I\'ll reverse whatever you send me`,
    thread: tRev
  }),
  new Message({
    author: wait,
    sentAt: moment().subtract(4, 'minutes').toLocaleString(),
    body: `I\'ll wait however many seconds you send to me before responding. Try sending '3'`,
    thread: tWait
  }),
];

export class ChatExampleData {
  static init(messagesService: MessagesService,
              threadsService: ThreadsService,
              userService: UserService): void {

    // TODO make `messages` hot
    messagesService.messages.subscribe(() => ({}));

    // set "Juliet" as the current user
    userService.setCurrentUser(me);

    // create the initial messages
    initialMessages.map( (message: Message) => messagesService.addMessage(message) );

    threadsService.setCurrentThread(tEcho);

    this.setupBots(messagesService);
  }

  static setupBots(messagesService: MessagesService): void {

    // echo bot
    messagesService.messagesForThreadUser(tEcho, echo)
      .forEach( (message: Message): void => {
          messagesService.addMessage(
            new Message({
              author: echo,
              body: message.body,
              thread: tEcho
            })
          );
        },
        null);


    // reverse bot
    messagesService.messagesForThreadUser(tRev, rev)
      .forEach( (message: Message): void => {
          messagesService.addMessage(
            new Message({
              author: rev,
              body: message.body.split('').reverse().join(''),
              thread: tRev
            })
          );
        },
        null);

    // waiting bot
    messagesService.messagesForThreadUser(tWait, wait)
      .forEach( (message: Message): void => {

          let waitTime: number = parseInt(message.body, 10);
          let reply: string;

          if (isNaN(waitTime)) {
            waitTime = 0;
            reply = `I didn\'t understand ${message}. Try sending me a number`;
          } else {
            reply = `I waited ${waitTime} seconds to send you this.`;
          }

          setTimeout(
            () => {
              messagesService.addMessage(
                new Message({
                  author: wait,
                  body: reply,
                  thread: tWait
                })
              );
            },
            waitTime * 1000);
        },
        null);
  }
}
