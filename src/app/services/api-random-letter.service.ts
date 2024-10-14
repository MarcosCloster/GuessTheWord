import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private apiUrl='https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=5'
  constructor(private http:HttpClient) { }

  getWord(): Observable<any>{
    return this.http.get(this.apiUrl)
  }

}