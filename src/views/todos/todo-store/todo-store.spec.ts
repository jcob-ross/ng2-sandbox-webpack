import { describe, expect, it, beforeEach, beforeEachProviders, inject } from 'angular2/testing';
import { Todo, TodoStore, storageKey } from './todo-store';

describe('TodoStore', () => {
  beforeEachProviders(() => [TodoStore]);
  beforeEach(() => localStorage.removeItem(storageKey));

  describe('todos', () => {
    it('should return contain array of todos', inject([TodoStore], (store: TodoStore) => {
      expect(typeof store.todos === typeof Array)
    }));
    
    it('should have 0 remaining todos from start', inject([TodoStore], (store: TodoStore) => {
      expect(store.todos.length).toBe(0);
    }));
  });

  describe('addTodo', () => {
    it('should add one todo item to the store', inject([TodoStore], (store: TodoStore) => {
      store.addTodo('some title');
      expect(store.todos.length).toBe(1);
    }));

    it('should not add item with empty title', inject([TodoStore], (store: TodoStore) => {
      store.addTodo('');
      expect(store.todos.length).toBe(0);
    }));
  });

  describe('getRemaining', () => {
    it('should retrieve only todos that are not completed', inject([TodoStore], (store: TodoStore) => {
      let item = new Todo('foo');
      let completed = new Todo('bar');
      completed.completed = true;
      store.todos.push(item);
      store.todos.push(completed);

      let items = store.getRemaining();
      expect(items.length).toBe(1);
      expect(items[0].completed).toBe(false);
    }));
  });

  describe('removeTodo', () => {
    it('remove the correct item', inject([TodoStore], (store: TodoStore) => {
      store.todos.push(new Todo('foo'));
      let item = new Todo('bar');
      store.todos.push(item);

      store.removeTodo(item);

      expect(store.todos.length).toBe(1);
      expect(store.todos[0].title).toBe('foo');
    }));

    it('should not have side effects if the item is not from the store', inject([TodoStore], (store: TodoStore) => {
      store.todos.push(new Todo('foo'));
      let item = new Todo('foo');

      store.removeTodo(item);

      expect(store.todos.length).toBe(1);
      expect(store.todos[0].title).toBe('foo');
    }));
  });

  describe('toggleComplete', () => {
    it('should toggle complete property of the item', inject([TodoStore], (store: TodoStore) => {
      let completed = new Todo('bar');
      completed.completed = true;
      store.todos.push(completed);

      store.toggleComplete(completed);

      expect(store.todos[0].completed).toBe(false);
    }));
  });

  describe('setAll', () => {
    it('should set complete property of all items in store', inject([TodoStore], (store: TodoStore) => {
      let completed = new Todo('bar');
      completed.completed = true;
      store.todos.push(completed);
      completed = new Todo('foo');
      completed.completed = true;
      store.todos.push(completed);

      store.setAll(false);

      expect(store.todos[0].completed).toBe(false);
      expect(store.todos[1].completed).toBe(false);
    }));
  });

  describe('removeCompleted', () => {
    it('should remove only completed items', inject([TodoStore], (store: TodoStore) => {
      let completed = new Todo('bar');
      completed.completed = true;
      store.todos.push(completed);
      completed = new Todo('foo');
      completed.completed = false;
      store.todos.push(completed);

      store.removeCompleted();
      
      expect(store.todos[0].completed).toBe(false);
      expect(store.todos[0].title).toBe('foo');
    }));
  });

  describe('allCompleted', () => {
    it('should return false if not all items are completed', inject([TodoStore], (store: TodoStore) => {
      let completed = new Todo('bar');
      completed.completed = true;
      store.todos.push(completed);
      completed = new Todo('foo');
      completed.completed = false;
      store.todos.push(completed);

      expect(store.allCompleted()).toBe(false);
    }));

    it('should return true if all items are completed', inject([TodoStore], (store: TodoStore) => {
      let completed = new Todo('bar');
      completed.completed = true;
      store.todos.push(completed);
      completed = new Todo('foo');
      completed.completed = true;
      store.todos.push(completed);

      expect(store.allCompleted()).toBe(true);
    }));
  });

});
