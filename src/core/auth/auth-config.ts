export interface IAuthConfig {
  headerName: string;
  headerPrefix: string;
  tokenName: string;
  tokenGetter: any;
  noJwtError: boolean;
  globalHeaders: Array<Object>;
}

/**
 * Represents configuration for AuthHttp
 */
export class AuthConfig {
  config: any;
  headerName: string;
  headerPrefix: string;
  tokenName: string;
  tokenGetter: any;
  noJwtError: boolean;
  noTokenScheme: boolean;
  globalHeaders: Array<Object>;

  constructor(config?: any) {
    this.config = config || {};
    this.headerName = this.config.headerName || 'Authorization';
    if (this.config.headerPrefix) {
      this.headerPrefix = this.config.headerPrefix + ' ';
    } else if (this.config.noTokenScheme) {
      this.headerPrefix = '';
    } else {
      this.headerPrefix = 'Bearer ';
    }
    this.tokenName = this.config.tokenName || 'id_token';
    this.noJwtError = this.config.noJwtError || false;
    this.tokenGetter = this.config.tokenGetter || (() => localStorage.getItem(this.tokenName));
    this.globalHeaders = this.config.globalHeaders || null;
  }

  /**
   * Returns copy of the config object
   * @returns {{headerName: string, headerPrefix: string, tokenName: string, tokenGetter: any, noJwtError: boolean, emptyHeaderPrefix: boolean, globalHeaders: Array<Object>}}
   */
  getConfig() {
    return {
      headerName: this.headerName,
      headerPrefix: this.headerPrefix,
      tokenName: this.tokenName,
      tokenGetter: this.tokenGetter,
      noJwtError: this.noJwtError,
      emptyHeaderPrefix: this.noTokenScheme,
      globalHeaders: this.globalHeaders
    }
  }
}