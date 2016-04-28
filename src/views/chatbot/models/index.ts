
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export class User {
  id: string;
  constructor(public name: string) {
    this.id = guid();
  }
}

export class Thread {
  id: string;
  lastMessage: Message;
  name: string;

  constructor(id?: string, name?: string) {
    this.id = id || guid();
    this.name = name;
  }
}

export class Message {
  id: string;
  sentAt: Date;
  isRead: boolean;
  author: User;
  body: string;
  thread: Thread;

  constructor(obj?: any) {
    this.id              = obj && obj.id              || guid();
    this.isRead          = obj && obj.isRead          || false;
    this.sentAt          = obj && obj.sentAt          || new Date();
    this.author          = obj && obj.author          || null;
    this.body            = obj && obj.body            || null;
    this.thread          = obj && obj.thread          || null;
  }
}