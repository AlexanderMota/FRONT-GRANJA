import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SolicitudModel } from '../models/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  //Obtiene todas las solicitudes
  //private urlGetAllSolicitudes = 'https://api-granja.azurewebsites.net/api/tareas/solicitudes/todas';
  private urlGetAllSolicitudes = 'http://localhost:4300/api/tareas/solicitudes/todas';
  
  //Añade un trabajor a una tarea
  //private urlConfirmaSolicitud = 'https://api-granja.azurewebsites.net/api/tareas/addempleado';
  private urlConfirmaSolicitud = 'http://localhost:4300/api/tareas/addempleado';

  //Añade un trabajor a una tarea
  //private urlConfirmaSolicitud = 'https://api-granja.azurewebsites.net/api/tareas/addempleado';
  private urlGetSolicitudById = 'http://localhost:4300/api/tareas/solicitud/';

  constructor(private http: HttpClient) { }

  getAllSolicitudes(token:string):Observable<[SolicitudModel]> {
    return this.http.get<[SolicitudModel]>(this.urlGetAllSolicitudes, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getSolicitud(token:string,id:string):Observable<SolicitudModel> {
    console.log(id);
    return this.http.get<SolicitudModel>(this.urlGetSolicitudById+id, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
