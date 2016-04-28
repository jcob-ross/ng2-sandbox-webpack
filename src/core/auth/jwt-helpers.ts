declare var escape: any;

/**
 * Helper class to decode and find JWT expiration.
 * @Author: chenkie@Auth0
 */
export class JwtHelper {

  public static urlBase64Decode(str:string) {
    var output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw 'Illegal base64url string!';
      }
    }
    return decodeURIComponent(escape(window.atob(output))); // polyfill https://github.com/davidchambers/Base64.js
  }

  public static decodeToken(token:string) {
    var parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    var decoded = JwtHelper.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  }

  public static getTokenExpirationDate(token:string) {
    var decoded: any;
    decoded = JwtHelper.decodeToken(token);
    if(typeof decoded.exp === 'undefined') {
      return null;
    }
    var date = new Date(0); // 0 sets date to the beginning of epoch
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  public static isTokenExpired(token:string, offsetSeconds?:number) {
    var date = JwtHelper.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (date === null) {
      return false;
    }
    // token expiration check
    return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
  }
}