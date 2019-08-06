import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static readonly BASE_URL = '/api/user'
  static readonly ADMIN = 'ROLE_ADMIN'
  static readonly ADMIN_DEFAULT = false;

  constructor(private httpClient: HttpClient) { }

  getRoles(successFunc: (roles: string[]) => any, 
    errorFunc: (e: HttpErrorResponse) => any = e => {
      alert('Permissions load failed, see console for details.')
      console.log(e);
    }) {

    this.httpClient.get<User>(AuthService.BASE_URL).subscribe(
      u => {
        let user = Object.assign(new User(), u);
        successFunc(user.getRoles());
      }, 
      errorFunc);
  }

}
