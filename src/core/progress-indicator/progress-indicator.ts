import { ConnectionBackend, Connection, Request, Response, ReadyState,
         XHRConnection, BrowserXhr, ResponseOptions } from 'angular2/http';
import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Observable';

export class ProgressTrackedConnection implements Connection {
  private _baseConnection: XHRConnection;
  private static _pendingRequests: number = 0;
  private static _trackingObserver;
  static pending: Observable<boolean> = new Observable (observer => ProgressTrackedConnection._trackingObserver = observer);

  constructor(req: Request, browserXHR: BrowserXhr, baseResponseOptions?: ResponseOptions) {
    this._baseConnection = new XHRConnection(req, browserXHR, baseResponseOptions);
    ProgressTrackedConnection.requestStarted();
    this.response.subscribe(() => {
      ProgressTrackedConnection.requestEnded();
    });
  }

  static requestStarted() {
    if (ProgressTrackedConnection._pendingRequests == 0) {
      ProgressTrackedConnection._trackingObserver.next(true);
    }
    ProgressTrackedConnection._pendingRequests++;
  }

  static requestEnded() {
    if (ProgressTrackedConnection._pendingRequests == 1) {
      ProgressTrackedConnection._trackingObserver.next(false);
    }
    ProgressTrackedConnection._pendingRequests--;
  }

  get readyState(): ReadyState {
    return this._baseConnection.readyState;
  }
  get request(): Request {
    return this._baseConnection.request;
  }
  get response(): Observable<Response> {
    return this._baseConnection.response;
  }
}

@Injectable()
export class ProgressTrackedBackend implements ConnectionBackend {
  constructor(private _browserXHR: BrowserXhr, private _baseResponseOptions: ResponseOptions) {}
  createConnection(request: Request): ProgressTrackedConnection {
    return new ProgressTrackedConnection(request, this._browserXHR, this._baseResponseOptions);
  }
}