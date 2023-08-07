import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UbicacionModel } from '../models/ubicacion.model';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  private baseUrl = 'http://localhost:4300/api/ubicacion/';
  private urlUbiByIdTarea = this.baseUrl+"tarea/";

  constructor(private http: HttpClient) { }

  getAllUbicaciones(token:string,pageSize = 20,pageNum = 1):Observable<[UbicacionModel]> {
    return this.http.get<[UbicacionModel]>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getUbiByIdTarea(token:string, idTarea:string,pageSize = 1,pageNum = 1):Observable<[UbicacionModel]> {
    return this.http.get<[UbicacionModel]>(this.urlUbiByIdTarea+idTarea, {
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
