import { Injectable } from 'angular2/core';
import * as moment from 'moment';

export class Todo {
  private _title: String;
  private _date: Date;
  private _note: string = '';
  private _hasNote: boolean = false;
  completed: Boolean;
  constructor(title: String) {
    if (typeof title === 'undefined') title = '';
    this.completed = false;
    this.title = title.trim();
    this._date = new Date();
  }

  get date(): Date {
    return this._date;
  }
  set date(date: Date){
    this._date = date;
  }

  get hasNote(): boolean {
    return this._hasNote;
  }

  set hasNote(bool: boolean) {
    if (!bool) this._note = '';
    this._hasNote = bool;
  }

  get note(): string {
    return this._note;
  }

  set note(text: string) {
    if (text && text.length > 0){
      this._note = text;
    }
  }

  getDateNice(format: string){
    return moment(this._date).format(format);
  }

  get dateFromNow(): String {
    return moment(this._date).fromNow();
  }

  get title(): String {
    return this._title;
  }
  set title(value: String) {
    this._title = value.trim();
  }
}

export const storageKey: string = 'local-todos';

@Injectable()
export class TodoStore {
  todos: Array<Todo>;

  constructor(){
    let storedTodos = JSON.parse(localStorage.getItem(storageKey) || '[]');
    this.todos = storedTodos.map( (todo: {_title: String, completed: Boolean, _date: Date, _note: string, _hasNote: boolean}) => {
      let item = new Todo(todo._title);
      item.date = todo._date;
      item.completed = todo.completed;
      item.note = todo._note;
      item.hasNote = todo._hasNote;
      return item;
    });
  }

  private updateStore(): void {
    localStorage.setItem(storageKey, JSON.stringify(this.todos));
  }

  private getFiltered(completed: Boolean): Array<Todo> {
    return this.todos.filter((item: Todo) => item.completed == completed);
  }

  /**
   * Creates new Todo item and adds it to the store
   * @param title - Non-empty title of the new todo item
   */
  public addTodo(title: string): void {
    if (!title) return;
    let newItem = new Todo(title);
    this.todos.push(newItem);
    this.updateStore();
  }

  /**
   * Removes given todo item from the store
   * @param item - Todo item to be removed
   */
  public removeTodo(item: Todo): void {
    let index = this.todos.indexOf(item);
    if (index < 0) return;
    this.todos.splice(index, 1);
    this.updateStore();
  }

  /**
   * Retrieves all todos that have been completed
   * @returns {Array<Todo>} - Array of completed todos
   */
  public getCompleted(): Array<Todo> {
    return this.getFiltered(true);
  }

  /**
   * Retrieves all uncompleted todos
   * @returns {Array<Todo>} Array of todos to be completed
   */
  public getRemaining(): Array<Todo> {
    return this.getFiltered(false);
  }

  /**
   * Toggles complete state of a todo item
   * @param item Todo item to toggle it's complete state
   */
  public toggleComplete(item: Todo): void {
    item.completed = !item.completed;
    this.updateStore()
  }

  /**
   * Sets all todo items in store to given completed state
   * @param completed - State you want all todo items to be
   */
  public setAll(completed: Boolean): void {
    this.todos.forEach((item: Todo) => item.completed = completed);
    this.updateStore()
  }

  /**
   * Checks whether all todo items have been completed
   * @returns {boolean} - Returns true if all todo items are completed, False otherwise
   */
  public allCompleted(): Boolean {
    return this.todos.length == this.getCompleted().length;
  }

  /**
   * Removes all completed todo items
   */
  public removeCompleted(): void {
    this.todos = this.getFiltered(false);
    this.updateStore();
  }

  public updateTodoNote(item: Todo){
      let index = this.todos.indexOf(item);
      if (index < 0) return;

      this.updateStore();
  }
}