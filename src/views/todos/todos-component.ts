import { Component, ViewEncapsulation, ChangeDetectionStrategy } from 'angular2/core';
import * as moment from 'moment';
import {TodoStore, Todo} from "./todo-store";
import {TodoDetail} from "./todo-detail/todo-detail-component";
import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

let styles = require('!raw!postcss-loader!sass!./todos-component.scss');
let template = require('./todos-component.html');

@Component({
  directives: [ TodoDetail, TOOLTIP_DIRECTIVES ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'todos',
  styles: [ styles ],
  template: template,
  encapsulation: ViewEncapsulation.None
})
export class TodosComponent {
  now: string = moment().format('MMMM Do YYYY, h:mm:ss a');
  todoStore: TodoStore;
  newTodoText: string = '';
  selectedTodo: Todo;
  hideCompleted: boolean = false;
  constructor(todoStore: TodoStore){
    this.todoStore = todoStore;
  }

  selectTodo(item: Todo) {
    this.selectedTodo = item;
  }

  addTodo() {
    if (this.newTodoText.trim().length) {
      this.todoStore.addTodo(this.newTodoText);      
      this.newTodoText = '';
    }
  }

  remove(todo: Todo){
    this.todoStore.removeTodo(todo);
    if (todo == this.selectedTodo) this.selectedTodo = null;
  }

  toggleComplete(todo: Todo) {
    this.todoStore.toggleComplete(todo);
  }

  removeCompleted() {
    if (this.selectedTodo && this.selectedTodo.completed) this.selectedTodo = null;
    this.todoStore.removeCompleted();
  }
}