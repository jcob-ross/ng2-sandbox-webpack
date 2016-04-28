import { provide, Injectable } from 'angular2/core';
import { Http, Headers, Request, RequestOptions, RequestOptionsArgs, RequestMethod, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { IAuthConfig, AuthConfig } from './auth-config';
import { tokenNotExpired } from "./auth-helpers";

/**
 * Add this provider to Angular 2 bootstrap call
 * @type {Provider[]}
 */
export const AUTH_PROVIDERS_JWT: any = [
  provide(AuthHttp, {
    useFactory: (http: Http) => {
      return new AuthHttp(new AuthConfig(), http);
    },
    deps: [ Http ]
  })
];

/**
 * Allows for explicit, authenticated Http requests
 */
@Injectable()
export class AuthHttp {
  private _config: IAuthConfig;
  public tokenStream: Observable<string>;

  /**
   * Creates new instance of AuthHttp
   * @param options - Configuration object
   * @param http - Angular's Http
   */
  constructor(options: AuthConfig, private http: Http) {
    this._config = options.getConfig();
    this.tokenStream = new Observable<string>((obs: any) => {
      obs.next(this._config.tokenGetter())
    });
  }

  /**
   * Sets headers for all requests made by this instance of AuthHttp
   */
  setGlobalHeaders(headers: Array<Object>, request: Request | RequestOptionsArgs) {
    headers.forEach((header: Object) => {
      let key: string = Object.keys(header)[0];
      let headerValue: string = (<any>header)[key];
      request.headers.set(key, headerValue);
    });
  }

  /**
   * Performs any type of http request
   * @param url - Url of the request or Request object, required
   * @param options - Optional request options
   * @returns {Observable<Response>} - Observable containing Response object
   */
  request(url: string | Request, options?: RequestOptionsArgs) : Observable<Response> {

    let request: Observable<Response>;
    let globalHeaders = this._config.globalHeaders;

    if (!tokenNotExpired(null, this._config.tokenGetter())) {
      if (!this._config.noJwtError) {
        return new Observable<Response>((obs: any) => {
          obs.error(new Error('No JWT present'));
        });
      } else {
        request = this.http.request(url, options);
      }

    } else if (typeof url === 'string') {
      let reqOpts: RequestOptionsArgs = options || {};

      if (!reqOpts.headers) {
        reqOpts.headers = new Headers();
      }

      if (globalHeaders) {
        this.setGlobalHeaders(globalHeaders, reqOpts);
      }

      reqOpts.headers.set(this._config.headerName, this._config.headerPrefix + this._config.tokenGetter());
      request = this.http.request(url, reqOpts);

    } else {
      let req: Request = <Request>url;

      if (!req.headers) {
        req.headers = new Headers();
      }

      if (globalHeaders) {
        this.setGlobalHeaders(globalHeaders, req);
      }

      req.headers.set(this._config.headerName, this._config.headerPrefix + this._config.tokenGetter());
      request = this.http.request(req);
    }

    return request;
  }

  private requestHelper(requestArgs: RequestOptionsArgs, additionalOptions: RequestOptionsArgs) : Observable<Response> {
    let options: RequestOptions = new RequestOptions(requestArgs);

    if (additionalOptions) {
      options = options.merge(additionalOptions)
    }

    return this.request(new Request(options))
  }

  /**
   * Performs a request with `GET` http method.
   * @returns {Observable<Response>}
   */
  httpGet(url: string, options?: RequestOptionsArgs) : Observable<Response> {
    return this.requestHelper({ url:  url, method: RequestMethod.Get }, options);
  }

  /**
   * Performs a request with `POST` http method.
   * @returns {Observable<Response>}
   */
  httpPost(url: string, body: string, options?: RequestOptionsArgs) : Observable<Response> {
    return this.requestHelper({ url:  url, body: body, method: RequestMethod.Post }, options);
  }

  /**
   * Performs a request with `PUT` http method.
   * @returns {Observable<Response>}
   */
  httpPut(url: string, body: string, options ?: RequestOptionsArgs) : Observable<Response> {
    return this.requestHelper({ url:  url, body: body, method: RequestMethod.Put }, options);
  }

  /**
   * Performs a request with `DELETE` http method.
   * @returns {Observable<Response>}
   */
  httpDelete(url: string, options ?: RequestOptionsArgs) : Observable<Response> {
    return this.requestHelper({ url:  url, method: RequestMethod.Delete }, options);
  }

  /**
   * Performs a request with `PATCH` http method.
   * @returns {Observable<Response>}
   */
  httpPatch(url: string, body:string, options?: RequestOptionsArgs) : Observable<Response> {
    return this.requestHelper({ url:  url, body: body, method: RequestMethod.Patch }, options);
  }

  /**
   * Performs a request with `HEAD` http method.
   * @returns {Observable<Response>}
   */
  httpHead(url: string, options?: RequestOptionsArgs) : Observable<Response> {
    return this.requestHelper({ url:  url, method: RequestMethod.Head }, options);
  }
}