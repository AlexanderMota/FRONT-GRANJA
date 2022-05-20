import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse.model';
import { SolicitudModel } from '../models/solicitud.model';
import { TareaModel } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  //Get: Obtiene todas las tareas
  //Post: Añade una tarea
  //private urlGetAllTareas = 'https://api-granja.azurewebsites.net/api/tareas/solicitudes/todas';
  private urlGetAllTareas = 'http://localhost:4300/api/tareas';

  constructor(private http: HttpClient) { }

  getAllTareas(token:string):Observable<[TareaModel]> {
    return this.http.get<[TareaModel]>(this.urlGetAllTareas, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getTareaById(token:string,id:string):Observable<TareaModel> {
    //console.log(id);
    return this.http.get<TareaModel>(this.urlGetAllTareas+id, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  postTarea(token:string,tar:TareaModel):Observable<ApiResponse>{
    tar.idTarea = 0;
    return this.http.post<ApiResponse>(this.urlGetAllTareas, tar,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
