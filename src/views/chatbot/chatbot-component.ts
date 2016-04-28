import { Component, ViewEncapsulation } from 'angular2/core';
import { MessageCounter } from './message-counter/message-counter';
import { ChatThreads } from './chat-threads/chat-threads-component';
import { ChatWindow, ChatMessage } from './chat-window/chat-window-component';

import {MessagesService} from './services/messages-service';
import {ThreadsService} from './services/threads-service';
import {UserService} from './services/user-service';
import {ChatExampleData} from "./models/seed-data";

let template = require('./chatbot-component.html');

@Component({
  directives: [MessageCounter, ChatMessage, ChatThreads, ChatWindow],
  selector: 'chat-bot',
  template: template,
})
export class ChatBotsComponent {
  constructor(public messagesService: MessagesService,
              public threadsService: ThreadsService,
              public userService: UserService) {
    ChatExampleData.init(messagesService, threadsService, userService);
  }
}