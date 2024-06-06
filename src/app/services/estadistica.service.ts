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
  private readonly urlEmpleadosEst = this.baseUrl + 'empleados/';
  private readonly urlSolicitudesEst = this.baseUrl + 'solicitudes/';
  private readonly urlTareasEst = this.baseUrl + 'tareas/';

  constructor(private http: HttpClient) { }
  
  getComentariosEst(token:string):Observable<{ time: string, value: number }[] | ApiResponse> {
    return this.http.get<{ time: string, value: number }[] | ApiResponse>(this.urlComentariosEst, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getEmpleadosEst(token:string):Observable<{ time: string, value: number }[] | ApiResponse> {
    return this.http.get<{ time: string, value: number }[] | ApiResponse>(this.urlEmpleadosEst, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }/*
  getSolicitudesEst(token:string):Observable<{ time: string, value: number }[] | ApiResponse> {
    return this.http.get<{ time: string, value: number }[] | ApiResponse>(this.urlSolicitudesEst, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }*/
  getTareasEst(token:string):Observable<{ time: string, value: number }[] | ApiResponse> {
    return this.http.get<{ time: string, value: number }[] | ApiResponse>(this.urlTareasEst, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
