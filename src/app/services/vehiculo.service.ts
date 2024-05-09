import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { VehiculoModel } from '../models/vehiculo.model';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private baseUrl = 'http://localhost:4300/api/vehiculo/';
  private urlVehiByProp = this.baseUrl + "propietario/";
  private urlVehiByMatr = this.baseUrl + "matricula/";
  private urlVehiByPara = this.baseUrl + "parada/";
  private urlVehiByPasa = this.baseUrl + "pasajero/";
  
  constructor(private http: HttpClient) { }
  
  getAllVehiculos(token:string,pageSize = 20,pageNum = 1):Observable<VehiculoModel[] | ApiResponse> {
    return this.http.get<VehiculoModel[] | ApiResponse>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getVehiculosByPropietario( token:string, propietario:string, pageSize = 20, pageNum = 1 ):Observable<VehiculoModel[] | ApiResponse> {
    return this.http.get<VehiculoModel[] | ApiResponse>(this.urlVehiByProp+propietario, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getVehiculosByMatricula(token:string, matricula:string, pageSize = 20, pageNum = 1):Observable<VehiculoModel | ApiResponse> {
    return this.http.get<VehiculoModel | ApiResponse>(this.urlVehiByMatr+matricula, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getVehiculosByIdParada(token:string, idParada:string, pageSize = 20, pageNum = 1):Observable<VehiculoModel[] | ApiResponse> {
    return this.http.get<VehiculoModel[] | ApiResponse>(this.urlVehiByPara+idParada, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }


  postVehiculo(token:string, vehiculo:VehiculoModel):Observable<ApiResponse> {
    const {matricula, propietario, plazas, descripcion} = vehiculo;
    return this.http.post<ApiResponse>(this.baseUrl, {matricula,propietario, plazas, descripcion},{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }

  patchVehiculo(token:string, matricula:string,pasajero:string):Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(this.urlVehiByPasa+matricula+"?pasajero="+pasajero,{},{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}