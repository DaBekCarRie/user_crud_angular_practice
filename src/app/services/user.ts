import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginResponse,
  PaginatedUserResponse,
  SignUpResponse,
  UserLogin,
  UserRegister,
} from '../models/user';
import { Observable } from 'rxjs';
const BASE_URL = 'https://api.freeprojectapi.com';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  registerUser(obj: UserRegister): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(
      BASE_URL + '/api/UserApp/CreateNewUser',
      obj
    );
  }
  loginUser(obj: UserLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(BASE_URL + '/api/UserApp/login', obj);
  }
  getUsers(
    pageNumber: number,
    pageSize: number,
    searchText?: string
  ): Observable<PaginatedUserResponse> {
    const params = new HttpParams()
      .set('searchText', searchText ?? '')
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedUserResponse>(
      'https://api.freeprojectapi.com/api/UserApp/searchUsers',
      { params }
    );
  }
}
