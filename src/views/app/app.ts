import { Component } from 'angular2/core';
import { RouteConfig, RouterLink, RouterOutlet } from 'angular2/router';
import { Home } from '../../views/home';
import { TodosComponent } from "../todos";
import { PongComponent } from "../pong/pong-component";
import { RouterActive } from "../../core/router-active";
import { LoadingBarComponent } from "../loading-bar/loading-bar-demo";
import { LoadingBar } from "../../core/loading-bar";
import { ChatBotsComponent } from "../chatbot";

let template = require('./app.html');

@RouteConfig([
  {path: '/',               name: 'Home',           component: Home,              useAsDefault: true},
  {path: '/todos',          name: 'Todos',          component: TodosComponent},
  {path: '/pong',           name: 'Pong',           component: PongComponent},
  {path: '/loading-bar',    name: 'Loading Bar',    component: LoadingBarComponent},
  {path: '/chat-bots',      name: 'Chat Bots',      component: ChatBotsComponent},
])
@Component({
  directives: [
    RouterLink,
    RouterOutlet,
    RouterActive,
    LoadingBar
  ],
  selector: 'app',
  template: template,
})
export class App {}
