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

  constructor(private http: HttpClient) { }

  postFotoPerfil(token:string, file:File):Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('archivo', file);

    return this.http.post<ApiResponse>(this.urlUpload, formData,{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
