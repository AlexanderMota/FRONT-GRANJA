import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from '../models/apiResponse.model';
import { ComentarioModel } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private baseUrl = 'http://localhost:4300/api/tareas/';
  private urlComentariosByIdTarea = this.baseUrl+"comentarios/";
  private urlAgregaComentarioATarea = this.baseUrl+"addcomentario/";

  constructor(private http: HttpClient) { }

  getAllComentariosByIdTarea(token:string, idTarea:string,pageSize = 20,pageNum = 1):Observable<[ComentarioModel]> {
    return this.http.get<[ComentarioModel]>(this.urlComentariosByIdTarea+idTarea, {
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
} 