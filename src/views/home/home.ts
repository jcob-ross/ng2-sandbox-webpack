import { Component } from 'angular2/core';
import { Alert, DATEPICKER_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'home',
  directives: [Alert, DATEPICKER_DIRECTIVES],
  template: `
<div class="container-fluid navbar-margin">
<div class="jumbotron">
<row>
    <ul>
      <li>
        <h3 class="project-item">Todos</h3>
        <p class="project-description">Small Todo app - add on key enter, hiding/removing completed, details view, 
        Todo notes with local storage persistence</p>
      </li>
      <li>
        <h3 class="project-item">Pong</h3>
        <p class="project-description">A Pong-like game - Up/Down arrow for movement, Space to pause, Esc to reset</p>
      </li>
      <li>
        <h3 class="project-item">Loading bar</h3>
        <p class="project-description">Http request indicator (with manual firing, not tied to any interceptor)</p>
      </li>
    </ul>
</row>
</div>
</div>
    
  `
})
export class Home {
  date: string = moment().format('MMMM Do YYYY, h:mm:ss a');
  locale: string = moment().locale();
}
