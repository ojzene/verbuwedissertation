import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private http: HttpClient) { }

    post(serviceName: string, data: any) {
        let headers: HttpHeaders = new HttpHeaders();
            headers = headers.append('Accept', 'application/json');
        const options = { headers: headers };
        const url = environment.apiUrl + serviceName;
        console.log("parsed Data:::", data);
        // return this.http.post(url, JSON.stringify(data), options);
        return this.http.post(url, data, options);
    }
  
    get(serviceName: string) {
        let headers: HttpHeaders = new HttpHeaders();
            headers = headers.append('Accept', 'application/json');
        const options = { headers: headers };
        const url = environment.apiUrl + serviceName;
        return this.http.get(url, options);
    }
}