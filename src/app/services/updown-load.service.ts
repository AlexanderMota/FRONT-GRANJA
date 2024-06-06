import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/apiResponse.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UpDownLoadService {
  private readonly baseUrl = 'http://localhost:4300/api/files/';
  private readonly urlUpload = this.baseUrl + "fileUp/";
  private readonly urlDownload = this.baseUrl + "fileDown/";

  constructor(private http: HttpClient) { }

  getFotoPerfil(token: string, userId: string): Observable<Blob | ApiResponse> {
    return this.http.get(`${this.urlDownload}${userId}`, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      responseType: 'blob' // Para indicar que se espera una respuesta de tipo Blob (binario)
    });
  }
  postFotoPerfil(token:string, userId:string, file:File):Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('archivo', file);

    return this.http.post<ApiResponse>(this.urlUpload+userId, formData,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
