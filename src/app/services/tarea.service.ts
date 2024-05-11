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
  private urlTareasByIdTarea = this.baseUrl+"byid/";
  private urlSubtareas = this.baseUrl+"subtareas/";
  private urlSuperTareas = this.baseUrl+"supertareas/";
  private urlTareasByIdEmpleado = this.baseUrl+"empleado/";
  private urlAgregaEmpleadoATarea = this.baseUrl+"addempleado/";

  constructor(private http: HttpClient) { }

  getAllTareas(token:string,pageSize = 20,pageNum = 1):Observable<TareaModel[] | ApiResponse> {
    return this.http.get<TareaModel[] | ApiResponse>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getTareaById(token:string,id:string):Observable<TareaModel | ApiResponse> {
    //console.log(id);
    return this.http.get<TareaModel | ApiResponse>(this.urlTareasByIdTarea+id ,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getTareaByIdEmpleado(token:string,idEmpleado:string):Observable<TareaModel[] | ApiResponse> {
    return this.http.get<TareaModel[] | ApiResponse>(this.urlTareasByIdEmpleado+idEmpleado ,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getSuperTareas(token:string):Observable<TareaModel[] | ApiResponse> {
    return this.http.get<TareaModel[] | ApiResponse>(this.urlSuperTareas ,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getSubtareas(token:string,idTarea:string, pageSize=20,
    pageNum=1):Observable<TareaModel[] | ApiResponse> {
    return this.http.get<TareaModel[] | ApiResponse>(this.urlSubtareas+idTarea ,{
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize:pageSize,
        pageNum:pageSize
      }
    });
  }
  postTarea(token:string,tar:TareaModel,idSuper:string ="0b"):Observable<ApiResponse>{
    tar.idTarea = 0;
    const {idTarea,nombre,descripcion,departamento,importancia,fechainicio,fechafin,terminada,plantilla,precioHora} = tar;
    return this.http.post<ApiResponse>(this.baseUrl, {idTarea,nombre,descripcion,departamento,importancia,fechainicio,fechafin,plantilla,precioHora,terminada},{
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        idSuper
      }
    });
  }
  postEmpleadoATarea(token:string,idTarea:string,idEmpleado:string,idSolicitud:string):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.urlAgregaEmpleadoATarea, {idTarea,idEmpleado,idSolicitud},{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  patchTarea(token:string,tar:TareaModel):Observable<ApiResponse>{
    tar.idTarea = 0;
    const {idTarea,nombre,descripcion,departamento,importancia,fechainicio,fechafin,terminada,plantilla,precioHora} = tar;
    return this.http.patch<ApiResponse>(this.baseUrl+tar._id,{idTarea,nombre,descripcion,departamento,importancia,fechainicio,fechafin,plantilla,precioHora,terminada},{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  deleteTarea(token:string,idTar:string):Observable< ApiResponse>{
    return this.http.delete<ApiResponse>(this.baseUrl+idTar,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  deleteEmpleadoTarea(token:string,idTar:string,idEmp:string):Observable< ApiResponse>{
    return this.http.delete<ApiResponse>(this.urlTareasByIdEmpleado+idTar+"_"+idEmp,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
