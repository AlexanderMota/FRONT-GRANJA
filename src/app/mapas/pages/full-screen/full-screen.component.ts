import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouteConfigLoadEnd } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { VehiculoModel } from 'src/app/models/vehiculo.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { environment } from 'src/environments/environment';
import { MapboxDirectionsService } from '../../services/mapbox-directions.service';
@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
    #mapa {
      width:100%;
      height:100%;
    }
    `
  ]
})
export class FullScreenComponent implements AfterViewInit {

  private vehiculos : VehiculoModel[] = [];
  @ViewChild('mapa_full') divMapa!: ElementRef;
  private mapa!:mapboxgl.Map;
  constructor(/*
    private vehiServ:VehiculoService*/) { 
  }
  ngOnInit(): void {
    
    

    
    //this.load( this.resRoute);

    /*this.vehiServ.getAllVehiculos(localStorage.getItem('token')!).subscribe(res=>{
      this.vehiculos = res.sort();
      console.log("vehiculos>"+this.vehiculos);
    },(err)=>{
      switch(err.error.status) { 
        case 401: { this.auth.logout();
          
          this.resPop.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
          this.auth.logout();
          
           break; 
        } 
        case 404: { 
          this.resPop.resMensajeErrBtn("No hay usuarios con ese nombre.");
           break; 
        } 
        case 0: { 
          this.resPop.resMensajeWrnBtn("Algo ha ido mal.");
           break; 
        } 
        default: { 
           //statements; 
           break; 
        } 
      } 
    });*/
  } 
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-0.4904,38.3464], // starting position
      zoom: 10
    });
    // set the bounds of the map
    /*const bounds = [
      [-123.069003, 45.395273],
      [-122.303707, 45.612333]
    ];*/
    /*
    Argument of type '{ 
      type: "circle"; 
      source: 
        { 
          type: "geojson"; 
          data: 
            { 
              type: "FeatureCollection"; 
              features: { 
                type: "Feature"; 
                properties: {}; 
                geometry: { 
                  type: "Point"; 
                  coordinates: number[]; 
                }; 
              }[]; 
            }; 
        }; 
        paint: { 
          'circle-radius': number; 
          'circle-color': string; 
        }; 
      }' is not assignable to parameter of type 'AnyLayer'.
  Property 'id' is missing in type '{ type: "circle"; source: { type: "geojson"; data: { type: "FeatureCollection"; features: { type: "Feature"; properties: {}; geometry: { type: "Point"; coordinates: number[]; }; }[]; }; }; paint: { 'circle-radius': number; 'circle-color': string; }; }' but required in type 'CircleLayer' */
    
    //this.mapa.setMaxBounds([bounds[0][0],bounds[0][1],bounds[1][0],bounds[1][1]]);
    
// an arbitrary start will always be the same
// only the end or destination will change
    //this.mapa.addControl(new mapboxgl.NavigationControl(), 'top-right');
    //this.mapa.addControl(new MapboxDirections({accessToken: mapboxgl.accessToken}), 'top-left');
  }
/*
  async getRoute(end = [-122.303707, 45.612333]) {
    
    const start = [-123.069003, 45.395273];
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (this.mapa.getSource('route')) {
      console.log("mapa source > "+this.mapa.getSource('route').type );//setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      this.mapa.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson,
          
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
    // add turn instructions here at the end
  }*/
  load(/*ruta: {routes: Array<string>, waypoints: Array<string>, code: string, uuid: string} */){
  
    // Add starting point to the map
    this.mapa.addLayer({
      id: 'point',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [-0.4904,38.3464]
              }
            }
          ]
        }
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#3887be'
      }
    }
    );
  }
  /*map.on('load', () => {
    // make an initial directions request that
    // starts and ends at the same location
    getRoute(start);
  
    // Add starting point to the map
    map.addLayer({
      id: 'point',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: start
              }
            }
          ]
        }
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#3887be'
      }
    });
    // this is where the code from the next step will go
  });*/
}
