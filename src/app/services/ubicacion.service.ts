import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UbicacionModel } from '../models/ubicacion.model';
import { environment } from 'src/environments/environment';
import { MapBoxResponseModel } from '../models/mapBoxResponse.model';
import { MapBoxRouteResponseModel } from '../models/mapBoxRouteResponse.model';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  private baseUrl = 'http://localhost:4300/api/ubicacion/';
  private urlUbiByIdTarea = this.baseUrl+"tarea/";
  private urlUbiParadas = this.baseUrl+"paradas/";
  private urlUbiDeleteParada = this.urlUbiParadas+"delete/";

  private baseUrlMapBox = 'https://api.mapbox.com/';
  private urlMapBoxBuscaUbi = this.baseUrlMapBox + 'geocoding/v5/mapbox.places/';
  private urlMapBoxGetRoute = this.baseUrlMapBox + 'directions/v5/mapbox/';
  
  constructor(private http: HttpClient) { }

  getMapBoxRoute( medio = "",
    puntoPartida = [0.0,0.0], 
    puntoDestino = [0.0,0.0],
    geometries = "geojson" ) : Observable<MapBoxRouteResponseModel> {
    return this.http.get<MapBoxRouteResponseModel>(
      this.urlMapBoxGetRoute+medio+"/"+
      puntoPartida[0]+','+puntoPartida[1]+';'+
      puntoDestino[0]+','+puntoDestino[1], {
      params: {
        steps:true,
        geometries:geometries,
        access_token:environment.mapboxToken
      }
    });
  }
  getMapBoxUbicacionByCoordenadas(coord:{lng:number,lat:number}):
    Observable<MapBoxResponseModel> {
    return this.http.get<MapBoxResponseModel>(
      this.urlMapBoxBuscaUbi+coord.lng+","+coord.lat+".json", {
      params: {
        access_token:environment.mapboxToken
      }
    });
  }
  getMapBoxUbicacion(busca:string):Observable<MapBoxResponseModel> {
    return this.http.get<MapBoxResponseModel>(this.urlMapBoxBuscaUbi+busca+".json", {
      params: {
        access_token:environment.mapboxToken
      }
    });
  }
  getAllUbicaciones(token:string,
    pageSize = 20,
    pageNum = 1) : Observable<UbicacionModel[] | ApiResponse> {
    return this.http.get<UbicacionModel[] | ApiResponse>(this.baseUrl, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getUbiByIdTarea(token:string, 
    idTarea : string,
    pageSize = 1,
    pageNum = 1) : Observable<UbicacionModel[] | ApiResponse> {
    return this.http.get<UbicacionModel[] | ApiResponse>(this.urlUbiByIdTarea+idTarea, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  getUbiParadasDisp(token:string, 
    idTarea : string,
    pageSize = 1,
    pageNum = 1) : Observable<UbicacionModel[] | ApiResponse> {
    return this.http.get<UbicacionModel[] | ApiResponse>(this.urlUbiParadas+idTarea, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }


  postUbi(token:string,
    ubi:UbicacionModel,
    pageSize = 1,
    pageNum = 1) : Observable<ApiResponse> {
    const {idTarea,titulo,descripcion,longitud,latitud} = ubi;
    return this.http.post<ApiResponse>(this.baseUrl, {idTarea,titulo,descripcion,longitud,latitud}, {
      headers: new HttpHeaders({
        Authorization: token
      }),
      params: {
        pageSize,
        pageNum
      }
    });
  }
  postUbiParada(token:string,
    ubi:UbicacionModel,
  destino:string) : Observable<ApiResponse> {
    const {titulo,descripcion,longitud,latitud,fechasRecogida} = ubi;
    return this.http.post<ApiResponse>(this.urlUbiParadas+destino, {titulo,descripcion,longitud,latitud,fechasRecogida}, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  /*patchUbi(token:string,
    ubi:UbicacionModel,
    idUbi:string =""){
    const {titulo,descripcion,longitud,latitud,fechasRecogida} = ubi;
    if(idUbi == ""){
      if(ubi._id){
        idUbi = ubi._id;
      }
    }
    return this.http.patch<ApiResponse>(this.urlUbiById+idUbi, {titulo,descripcion,longitud,latitud,fechasRecogida}, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }*/
  patchParada(token:string,
    fechasRecogida:{
      fechaInicio: Date;
      fechaFin: Date;
      vehiculo: string;
    },idUbi:string){
    return this.http.patch<ApiResponse>(this.urlUbiParadas+idUbi, fechasRecogida, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  deleteParada(token:string,
    fechasRecogida:{
      fechaInicio: Date;
      fechaFin: Date;
      vehiculo: string;
    },idUbi:string){
    return this.http.patch<ApiResponse>(this.urlUbiDeleteParada+idUbi, fechasRecogida, {
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
}
export class EstilosMapBoxEnum {
  static baseurl: string = "mapbox://styles/mapbox/";
  static Calles: string = EstilosMapBoxEnum.baseurl + "streets-v12";
  static Caminos: string = EstilosMapBoxEnum.baseurl + "outdoors-v12";
  static Claro: string = EstilosMapBoxEnum.baseurl + "light-v11";
  static Oscuro: string = EstilosMapBoxEnum.baseurl + "dark-v11";
  static Terreno: string = EstilosMapBoxEnum.baseurl + "satellite-v9";
  static Satélite: string = EstilosMapBoxEnum.baseurl + "satellite-streets-v12";
  static Navegación: string = EstilosMapBoxEnum.baseurl + "navigation-day-v1";
  static Direcciones: string = EstilosMapBoxEnum.baseurl + "navigation-night-v1";
  static getArray():{ nombre: string; url: string; }[]{
    let arr = [];
    arr.push({nombre:"Calles",url:EstilosMapBoxEnum.Calles});
    arr.push({nombre:"Caminos",url:EstilosMapBoxEnum.Caminos});
    arr.push({nombre:"Claro",url:EstilosMapBoxEnum.Claro});
    arr.push({nombre:"Oscuro",url:EstilosMapBoxEnum.Oscuro});
    arr.push({nombre:"Terreno",url:EstilosMapBoxEnum.Terreno});
    arr.push({nombre:"Satélite",url:EstilosMapBoxEnum.Satélite});
    arr.push({nombre:"Navegación",url:EstilosMapBoxEnum.Navegación});
    arr.push({nombre:"Direcciones",url:EstilosMapBoxEnum.Direcciones});
    return arr;
  }
}
export class MediosTransporteMapBoxEnum {
  static conduccion_trafico: string = "driving-traffic";
  static conduccion: string = "driving";
  static caminando: string = "walking";
  static bicicleta: string = "cycling";
  static getArray():{ nombre: string; clave: string; }[]{
    let arr = [];
    arr.push({nombre:"Tráfico",clave:MediosTransporteMapBoxEnum.conduccion_trafico});
    arr.push({nombre:"Conducción",clave:MediosTransporteMapBoxEnum.conduccion});
    arr.push({nombre:"Caminando",clave:MediosTransporteMapBoxEnum.caminando});
    arr.push({nombre:"Bicicleta",clave:MediosTransporteMapBoxEnum.bicicleta});
    //console.log(arr);
    return arr;
  }
}