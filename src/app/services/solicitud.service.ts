import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse.model';
import { SolicitudModel } from '../models/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private baseUrl = 'http://localhost:4300/api';
  //Obtiene todas las solicitudes
  //private urlGetAllSolicitudes = 'https://api-granja.azurewebsites.net/api/tareas/solicitudes/todas';
  private urlGetAllSolicitudes = this.baseUrl+'/tareas/solicitudes/todas';
  
  //Añade un trabajor a una tarea
  //private urlConfirmaSolicitud = 'https://api-granja.azurewebsites.net/api/tareas/addempleado';
  private urlConfirmaSolicitud = this.baseUrl+'/tareas/addempleado';

  //Añade un trabajor a una tarea
  //private urlConfirmaSolicitud = 'https://api-granja.azurewebsites.net/api/tareas/addempleado';
  private urlGetSolicitudById = this.baseUrl+'/tareas/solicitud/';

  constructor(private http: HttpClient) { }

  getAllSolicitudes(token:string):Observable<[SolicitudModel]> {
    return this.http.get<[SolicitudModel]>(this.urlGetAllSolicitudes, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getSolicitudById(token:string,id:string):Observable<SolicitudModel> {
    console.log(id);
    return this.http.get<SolicitudModel>(this.urlGetSolicitudById+id, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  postEmpleadoATarea(token:string,idEmpleado:string,idTarea:string):Observable<ApiResponse> {
    //console.log(idEmpleado +" /// "+idTarea);
    return this.http.post<ApiResponse>(this.urlConfirmaSolicitud+
      "?idTarea="+idTarea+"&idEmpleado="+idEmpleado, "",{
      headers: new HttpHeaders({
        Authorization: token
      })/*,
      params:{
        idTarea:idTarea,
        idEmpleado:idEmpleado
      }*/
    });
  }
}
