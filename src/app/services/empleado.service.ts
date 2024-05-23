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
  
  private urlRoles = (this.baseUrl+'roles/');
  private urlDepartamentos = (this.baseUrl+'departamentos/');
  private urlEmpleadosPorTarea = (this.baseUrl+'tarea/');
  //private urlEmpleadoPorIdEmpleado = (this.baseUrl+'byid/');
  private urlEmpleadosPorTareaDist = (this.baseUrl+'disponibles/');

  constructor(private http: HttpClient) { }

  getAllEmpleados(token:string,pageSize = 20, pageNum = 1):Observable<EmpleadoModel[] | ApiResponse> {
    return this.http.get<EmpleadoModel[] | ApiResponse>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getEmpleadoById(token:string,id:string):Observable<EmpleadoModel | ApiResponse> {
    //console.log(id);
    return this.http.get<EmpleadoModel | ApiResponse>(this.baseUrl+id, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getRoles(token:string):Observable< string[] | ApiResponse> {
    //console.log(id);
    return this.http.get< string[] | ApiResponse>(this.urlRoles, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getDepartamentos(token:string):Observable<{ nombre: string; }[] | ApiResponse> {
    //console.log(id);
    return this.http.get<{ nombre: string; }[] | ApiResponse>(this.urlDepartamentos, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getEmpleadosByTarea(token:string,idTarea:string):Observable<EmpleadoModel[] | ApiResponse> {
    //console.log("idTarea: "+idTarea);
    return this.http.get<EmpleadoModel[] | ApiResponse>(this.urlEmpleadosPorTarea+idTarea, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  getEmpleadosByTareaDist(token:string,idTarea:string):Observable<EmpleadoModel[] | ApiResponse> {
    //console.log("idTarea: "+idTarea);
    return this.http.get<EmpleadoModel[] | ApiResponse>(this.urlEmpleadosPorTareaDist+idTarea, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  postEmpleado(token:string,tar:EmpleadoModel):Observable<ApiResponse>{
    //tar.idEmpleado = 0;
    return this.http.post<ApiResponse>(this.baseUrl, tar,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
