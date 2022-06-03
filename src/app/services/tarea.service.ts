import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse.model';
import { TareaModel } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  //Get: Obtiene todas las tareas
  //Post: Añade una tarea
  //private urlGetAllTareas = 'https://api-granja.azurewebsites.net/api/tareas/solicitudes/todas';
  private baseUrl = 'http://localhost:4300/api/tareas/';
  private urlTareasByIdEmpleado = this.baseUrl+"empleado/";

  constructor(private http: HttpClient) { }

  getAllTareas(token:string,pageSize = 20,pageNum = 1):Observable<[TareaModel]> {
    return this.http.get<[TareaModel]>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getTareaById(token:string,id:string):Observable<TareaModel> {
    //console.log(id);
    return this.http.get<TareaModel>(this.baseUrl+id ,{
      headers: new HttpHeaders({
        Authorization: token
      })/*,
      params:{
        id:id
      }*/
    });
  }
  getTareaByIdEmpleado(token:string,idEmpleado:string):Observable<[TareaModel]> {
    //console.log(id);
    return this.http.get<[TareaModel]>(this.urlTareasByIdEmpleado+idEmpleado ,{
      headers: new HttpHeaders({
        Authorization: token
      })/*,
      params:{
        id:id
      }*/
    });
  }
  patchTarea(token:string,tar:TareaModel):Observable<ApiResponse>{
    tar.idTarea = 0;
    //console.log(tar);
    const {idTarea,nombre,descripcion,importancia,fechainicio,fechafin,numeroTrabajadores,terminada} = tar;
    return this.http.patch<ApiResponse>(this.baseUrl+tar._id,{idTarea,nombre,descripcion,importancia,fechainicio,fechafin,numeroTrabajadores,terminada},{
      headers: new HttpHeaders({
        Authorization: token
      })/*,
      params:{
        id:tar._id
      }*/
    });
  }
  postTarea(token:string,tar:TareaModel):Observable<ApiResponse>{
    tar.idTarea = 0;
    const {idTarea,nombre,descripcion,importancia,fechainicio,fechafin,numeroTrabajadores,terminada} = tar;
    return this.http.post<ApiResponse>(this.baseUrl, {idTarea,nombre,descripcion,importancia,fechainicio,fechafin,numeroTrabajadores,terminada},{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  deleteTarea(token:string,tar:TareaModel):Observable<boolean>{
    //console.log(tar);
    return this.http.delete<boolean>(this.baseUrl+tar._id,{
      headers: new HttpHeaders({
        Authorization: token
      })/*,
      params:{
        id:tar._id
      }*/
    });
  }
}
