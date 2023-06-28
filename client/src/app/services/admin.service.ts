import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, User } from '../models/interfaces';
import { AuthenticationResponse, UpdateRequest } from '../models/web';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends CacheService {
  public selectedUser: User | undefined;
  public allUsers: User[] = [];

  constructor(
    protected httpClient: HttpClient,
    private authService: AuthService
  ) {
    super();
    this.getAllUsers();
  }

  getAllUsers(): Observable<HttpResponse<IUser[]>> {
    const url = '/metrics/api/v1/admin/';
    return this.httpClient.get<IUser[]>(url, {observe: 'response'});
  }

  updateUser(userid: string, field: string, value: string): Observable<HttpResponse<AuthenticationResponse>> {
    const update: UpdateRequest = {
      id: userid,
      field: field,
      value: value,
    };
    const url = '/metrics/api/v1/admin/';
    return this.httpClient.put<AuthenticationResponse>(url, update, {observe: 'response'});
  }

  deleteUser(): Observable<HttpResponse<Object>> {
    const url = `/metrics/api/v1/admin/user/${this.selectedUser?.id}`;
    return this.httpClient.delete(url, {observe: 'response'});
  }

  purgeMissions(purgeDate: Date): Observable<HttpResponse<Object>> {
    const pDate = new Date(Date.UTC(purgeDate.getFullYear(), 
      purgeDate.getMonth(), purgeDate.getDate()));
    const url = `/metrics/api/v1/admin/missions/${this.dateString(pDate)}`;
    return this.httpClient.delete(url, { observe: 'response'});
  }

  purgeOutages(purgeDate: Date): Observable<HttpResponse<Object>> {
    const pDate = new Date(Date.UTC(purgeDate.getFullYear(), 
      purgeDate.getMonth(), purgeDate.getDate()));
    const url = `/metrics/api/v1/admin/outages/${this.dateString(pDate)}`;
    return this.httpClient.delete(url, { observe: 'response'});
  }

  private dateString(msndate:Date): string {
    let sDate = `${msndate.getFullYear()}-`;
    if (msndate.getMonth() + 1 < 10) {
      sDate += "0";
    }
    sDate += `${msndate.getMonth() + 1}-`;
    if (msndate.getDate() < 10) {
      sDate += "0";
    }
    sDate += `${msndate.getDate()}`;
    return sDate
  }
}
