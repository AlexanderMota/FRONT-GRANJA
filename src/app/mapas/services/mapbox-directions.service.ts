import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapboxDirectionsService {
  /*
  https://api.mapbox.com/directions/v5/
  mapbox/
  cycling/
  -84.518641,39.134270;-84.512023,39.102779?
  geometries=geojson
  &access_token=pk.eyJ1IjoiMTAxMDYyNDAiLCJhIjoiY2w5dWIweXZ4MGZocjNvcGg1YjlzNnhpeCJ9.DmPJ19Ay2yJu2ps-0KMxXA */
  private baseUrl = 'https://api.mapbox.com/directions/v5/';
  private mapboxUrl = this.baseUrl + "mapbox/";
  
  constructor(private http: HttpClient) { }
  getIndicaciones(medio = "cycling",geometries = "geojson", puntoPartida = [0.0,0.0], puntoDestino = [0.0,0.0]):Observable<[any]> {
    medio += "/";
    return this.http.get<[any]>(this.mapboxUrl+medio+puntoPartida[0]+','+puntoPartida[1]+';'+puntoDestino[0]+','+puntoDestino[1], {
      params: {
        geometries:geometries,
        access_token:environment.mapboxToken
      }
    });
  }
}
