import { enableProdMode, provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';
import { APP_BASE_HREF, ROUTER_PROVIDERS } from 'angular2/router';

// root component
import { App } from './views/app';

// common styles
import './views/common/styles.scss';

// moment settings
import * as moment from 'moment';
moment.locale('cs');

import 'rxjs';

import { TodoStore } from './views/todos/todo-store';
import { LoadingBarService } from './core/loading-bar/loading-bar-service';

import { FromNowPipe } from "./core/fromNow-pipe";
import {chatServiceInjectables} from './views/chatbot/services';


if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

bootstrap(App, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  TodoStore,
  LoadingBarService,
  FromNowPipe,
  chatServiceInjectables,
  provide(APP_BASE_HREF, {useValue: '/'})
]).catch((error: Error) => console.error(error));
