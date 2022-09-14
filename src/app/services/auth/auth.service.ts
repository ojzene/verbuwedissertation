import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { StorageService } from '../storage/storage.service';

import { AuthConstants } from '../../config/auth-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private router: Router
  ) { }

  login(postData: any): Observable<any> {
    return this.httpService.post('api/login', postData);
  }

  signup(postData: any): Observable<any> {
    return this.httpService.post('api/create', postData);
  }

  verify(postData: any): Observable<any> {
    return this.httpService.post('api/verify', postData);
  }

  setPassword(postData: any): Observable<any> {
    return this.httpService.post('api/reset-password', postData);
  }
  
  createBeneficiary(postData: any): Observable<any> {
    return this.httpService.post('api/create-beneficiary', postData);
  }

  getUserBeneficiary(postData: any): Observable<any> {
    console.log("get beneficiary::", postData)
    return this.httpService.get('api/list-beneficiary/'+postData);
  }

  createTransfer(postData: any): Observable<any> {
    console.log("create transfer::", postData)
    return this.httpService.post('api/create-transfer', postData);
  }

  getTransactionHistory(postData: any): Observable<any> {
    console.log("get transaction::", postData)
    return this.httpService.get('api/list-transfer/'+postData);
  }

  postApiUrl(urlEndpoint, postData: any): Observable<any> {
    console.log("post api::", urlEndpoint, "::::", postData)
    return this.httpService.post('api'+urlEndpoint, postData);
  }

  getApiUrl(urlEndpoint: any): Observable<any> {
    console.log("get transaction::", urlEndpoint)
    return this.httpService.get('api'+urlEndpoint);
  }


  logout() {
    // this.router.navigate(['/login']);
    this.storageService.removeStorageItem(AuthConstants.AUTH).then(res => {
      this.router.navigate(['/login']);
    });
  }
}