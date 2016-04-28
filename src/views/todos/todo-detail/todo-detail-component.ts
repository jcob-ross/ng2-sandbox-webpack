import { Component, Input, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from 'angular2/core';
import { FORM_DIRECTIVES, NgIf, NgClass} from 'angular2/common';
import { TodoStore, Todo } from "../todo-store";
import { Autosize } from '../textarea-autosize';
import { Subscription } from 'rxjs';
let template = require('./todo-detail-component.html');

@Component({
  selector: 'todo-detail',
  template: template,
  directives: [ Autosize, FORM_DIRECTIVES, NgClass, NgIf ]
})
export class TodoDetail implements OnInit, OnDestroy {
  private _textareaEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  private _textarea$: Subscription;
  private _itemBackup: Todo;
  @Input() todoItem: Todo;

  updating: boolean = false;
  noteLength: number = 0;
  noteMaxLength: number = 3000;
  editingTitle: boolean = false;

  constructor(private _todoStore: TodoStore, private _changeDetector: ChangeDetectorRef) {
    this._itemBackup = new Todo('backup');
    // debounced save to local storage
    this._textarea$ = this._textareaEventEmitter
      .debounceTime(666)
      .subscribe((res: string) => {
        this.updating = false;
        this._saveNote();
        this._changeDetector.detectChanges();
      });
  }

  ngOnInit() {
    this.noteLength = this.todoItem.note.length;
  }

  ngOnDestroy() {
    this._textarea$.unsubscribe();
    this._saveNote();
  }

  private _saveNote(): void {
    this._todoStore.updateTodoNote(this.todoItem);
  }

  noteContentChanged(noteValue: string) {
    this.todoItem.note = noteValue;
    this.noteLength = noteValue.length;
    this.updating = true;
    this._textareaEventEmitter.emit(noteValue);
    this._changeDetector.detectChanges();
  }

  startEditingTitle(): void {
    this._itemBackup.title = this.todoItem.title;
    this._itemBackup.date = this.todoItem.date;
    this._itemBackup.completed = this.todoItem.completed;
    this.editingTitle = true;
  }
  saveTitleChanges(): void {
    if (this.todoItem.title.length < 1) {
      this._todoStore.removeTodo(this.todoItem);
      this.todoItem = null;
    } else {
      this.todoItem.date = new Date();
    }
    this.editingTitle = false;
    this._itemBackup = new Todo('backup');
  }

  discardTitleChanges(): void {
    this.todoItem.title = this._itemBackup.title;
    this.todoItem.date = this._itemBackup.date;
    this.todoItem.completed = this._itemBackup.completed;
    this.editingTitle = false;
  }
}