import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/apiResponse.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadisticaService {

  private readonly baseUrl = 'http://localhost:4300/api/estadisticas/';
  private readonly urlComentariosEst = this.baseUrl + 'comentarios/';

  constructor(private http: HttpClient) { }
  
  getComentariosEst(token:string):Observable<{ time: string, value: number }[] | ApiResponse> {
    return this.http.get<{ time: string, value: number }[] | ApiResponse>(this.urlComentariosEst, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
