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
  private urlGetAllEmpleados = 'http://localhost:4300/api/empleados/';

  constructor(private http: HttpClient) { }

  getAllEmpleados(token:string,pageSize = 20, pageNum = 1):Observable<[EmpleadoModel]> {
    return this.http.get<[EmpleadoModel]>(this.urlGetAllEmpleados, {
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
    return this.http.get<EmpleadoModel>(this.urlGetAllEmpleados+id, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  postEmpleado(token:string,tar:EmpleadoModel):Observable<ApiResponse>{
    tar.idEmpleado = 0;
    return this.http.post<ApiResponse>(this.urlGetAllEmpleados, tar,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
