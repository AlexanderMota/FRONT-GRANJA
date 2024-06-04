import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from '../models/apiResponse.model';
import { ComentarioModel } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private readonly baseUrl = 'http://localhost:4300/api/tareas/';
  private readonly urlComentariosByIdTarea = this.baseUrl+"comentarios/";
  private readonly urlAgregaComentarioATarea = this.baseUrl+"addcomentario/";

  constructor(private http: HttpClient) { }

  getAllComentariosByIdTarea(token:string, idTarea:string,pageSize = 20,pageNum = 1):Observable<ComentarioModel[] | ApiResponse> {
    return this.http.get<ComentarioModel[] | ApiResponse>(this.urlComentariosByIdTarea+idTarea, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  postComentarioByIdTarea(token:string,comment:ComentarioModel):Observable<ApiResponse>{
    const {idTarea,idAutor,nombre,descripcion} = comment;
    return this.http.post<ApiResponse>(this.urlAgregaComentarioATarea, {idTarea,idAutor,nombre,descripcion},{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  deleteComentarioTarea(token:string,idCom:string):Observable< ApiResponse>{
    return this.http.delete<ApiResponse>(this.urlComentariosByIdTarea+idCom,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
} 