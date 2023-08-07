import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { VehiculoModel } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private baseUrl = 'http://localhost:4300/api/vehiculo/';
  
  constructor(private http: HttpClient) { }
  
  getAllVehiculos(token:string,pageSize = 20,pageNum = 1):Observable<[VehiculoModel]> {
    return this.http.get<[VehiculoModel]>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
}