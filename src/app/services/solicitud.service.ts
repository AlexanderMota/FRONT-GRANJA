import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse.model';
import { SolicitudModel } from '../models/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private baseUrl = 'http://localhost:4300/api/solicitud';
  //Obtiene todas las solicitudes
  //private urlGetAllSolicitudes = 'https://api-granja.azurewebsites.net/api/tareas/solicitudes/todas';
  //private urlGetAllSolicitudes = this.baseUrl+'/todas';
  
  //Añade un trabajor a una tarea
  //private urlConfirmaSolicitud = 'https://api-granja.azurewebsites.net/api/tareas/addempleado';
  //private urlConfirmaSolicitud = this.baseUrl+'/tareas/addempleado';

  //Añade un trabajor a una tarea
  //private urlConfirmaSolicitud = 'https://api-granja.azurewebsites.net/api/tareas/addempleado';
  private urlGetSolicitudById = this.baseUrl+'/byid/';

  constructor(private http: HttpClient) { }

  getAllSolicitudes(token:string, pageSize=20, pageNum=1):Observable<SolicitudModel[] | ApiResponse> {
    return this.http.get<[SolicitudModel] | ApiResponse>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize:pageSize,
        pageNum:pageNum
      }
    });
  }
  getSolicitudById(token:string,id:string):Observable<SolicitudModel | ApiResponse> {
    console.log(id);
    return this.http.get<SolicitudModel | ApiResponse>(this.urlGetSolicitudById+id, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  postSolicitud(token:string,idTarea:string,idEmpleado:string):Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl,{idEmpleado:idEmpleado, idTarea:idTarea},{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  deleteSolicitud(token:string,idSolicitud:string):Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.urlGetSolicitudById+idSolicitud,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
