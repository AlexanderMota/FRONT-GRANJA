import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse.model';
import { EmpleadoModel } from '../models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {


  //Get: Obtiene todas las tareas
  //Post: Añade una tarea
  //private urlGetAllTareas = 'https://api-granja.azurewebsites.net/api/tareas/solicitudes/todas';
  private baseUrl = 'http://localhost:4300/api/empleados/';
  
  private urlEmpleadosPorTarea = (this.baseUrl+'tarea/');

  constructor(private http: HttpClient) { }

  getAllEmpleados(token:string,pageSize = 20, pageNum = 1):Observable<[EmpleadoModel]> {
    return this.http.get<[EmpleadoModel]>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getEmpleadoById(token:string,id:string):Observable<EmpleadoModel> {
    console.log(id);
    return this.http.get<EmpleadoModel>(this.baseUrl+id, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getEmpleadosByTarea(token:string,idTarea:string):Observable<[EmpleadoModel]> {
    //console.log("idTarea: "+idTarea);
    return this.http.get<[EmpleadoModel]>(this.urlEmpleadosPorTarea+idTarea, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  postEmpleado(token:string,tar:EmpleadoModel):Observable<ApiResponse>{
    tar.idEmpleado = 0;
    return this.http.post<ApiResponse>(this.baseUrl, tar,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
