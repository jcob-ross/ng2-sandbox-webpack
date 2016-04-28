import {JwtHelper} from "./jwt-helpers";

/**
 * Checks for presence of jwt token and validates it's expiration date.
 * Use in tandem with @CanActivate router decorator and *ngIf
 * @param tokenName - Name of the token to use as local storage key
 * @param jwt - The JWT token
 * @returns {boolean} - True if token is NOT expired, false otherwise
 */
export function tokenNotExpired(tokenName?:string, jwt?:string) {
  var authToken:string = tokenName || 'id_token';
  var token:string;
  if(jwt) {
    token = jwt;
  }
  else {
    token = localStorage.getItem(authToken);
  }
  if(!token || JwtHelper.isTokenExpired(token, null)) {
    return false;
  }
  else {
    return true;
  }
}