import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { AnySourceImpl } from 'mapbox-gl';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { MapboxDirectionsService } from '../../services/mapbox-directions.service';
@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
    .mapa-container {
      width:100%;
      height:100%;
    }
    .list-group {
      position:fixed;
      top:20px;
      right:20px;
      z-index:99;
    }
    li{
      cursor:pointer;
    }
  `]
})
/*
  "routes":[
    {
      "geometry":{
        "coordinates":[
          [-0.490461,38.346295],
          [-0.490731,38.346342],
          [-0.491237,38.347022],
          [-0.487238,38.348486],
          [-0.484456,38.348684],
          [-0.483721,38.351998],
          [-0.483057,38.352893],
          [-0.481872,38.353287],
          [-0.481629,38.353496],
          [-0.48029,38.355263],
          [-0.477459,38.356724],
          [-0.475531,38.357465],
          [-0.473123,38.355401],
          [-0.472462,38.355955]
        ],
        "type":"LineString"
      },
      "legs":[
        {
          "steps":[],
          "summary":"",
          "weight":849.5,
          "duration":771.8,
          "distance":2499.2
        }
      ],
      "weight_name":"cyclability",
      "weight":849.5,
      "duration":771.8,
      "distance":2499.2
    }
  ],
  "waypoints":[
    {
      "distance":12.817695312985169,
      "name":"plaça dels Estels",
      "location":[-0.490461,38.346295]
    },
    {
      "distance":5.998109298225197,
      "name":"",
      "location":[-0.472462,38.355955]
    }
  ],
  "code":"Ok",
  "uuid":"2XkmsdmKHhOEp6XiNQEbCwilCntaZYtsYOsJjeiBMRunstmV9OjChA=="
  
*/
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa_marca') divMapa!: ElementRef;
  mapa!:mapboxgl.Map;
  zoomLevel : number = 6;
  center:[number,number] = [-4, 39.5]; //España
  private resRoute :{
    routes: {
      geometry:{
        type:string
        coordinates:GeoJSON.Position[]
      },
      legs: {
        steps:[],
        summary:string,
        weight:number,
        duration:number,
        distance:number
      }[],
      weight_name:string,
      weight:number,
      duration:number,
      distance:number
    }[], 
    waypoints: {
      distance:number,
      name:string,
      location:GeoJSON.Position
    }[], 
    code: string, 
    uuid: string} = {
      routes: [], 
      waypoints: [], 
      code: "", 
      uuid: ""}; 

  marcadores:mapboxgl.Marker[] = [];

  constructor(
    private auth:AuthService,
    private resPop:ApiResponseService,
    private mapDirServ:MapboxDirectionsService) { }

  ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxToken;

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom:this.zoomLevel
    });
  }
  
  agregarMarcador(){
    const color ='#xxxxxx'.replace(/x/g, y =>(Math.random()*16|0).toString(16));
    
    this.divMapa

    this.marcadores.push(
      new mapboxgl.Marker({
        draggable:true,
        color:color
      }).setLngLat(this.mapa.getCenter())
          .addTo(this.mapa)
    );
    //console.log(this.marcadores[0].getLngLat());
    /*if(this.marcadores.length > 1){
      this.cargaRuta();
      this.muestraRuta();
    }*/
  }

  clickMarcador({lng= -4 ,lat= 40}){
    this.zoomLevel = 12;
    this.mapa.flyTo({
      center: [lng,lat],
      zoom:this.zoomLevel
    });
    this.cargaRuta();
    this.muestraRuta();
  }

  cargaRuta(){
    this.mapDirServ.getIndicaciones("driving","geojson", 
      [this.marcadores[0].getLngLat().lng,this.marcadores[0].getLngLat().lat],
      [this.marcadores[1].getLngLat().lng,this.marcadores[1].getLngLat().lat])
      .subscribe( res => {
      this.resRoute = (res as unknown as {
        routes: {
          geometry:{
            type:"",
            coordinates: GeoJSON.Position[]
          },
          legs: {
            steps:[],
            summary:"",
            weight:0,
            duration:0,
            distance:0
          }[],
          weight_name:"",
          weight:0,
          duration:0,
          distance:0
        }[], 
        waypoints: {
          distance:0,
        name:"",
        location:[]
      }[], 
        code: string, 
        uuid: string});
        //console.log(this.resRoute);
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
    });
    //console.log(this.marcadores[0].getLngLat().lng + " - " +this.resRoute);
  }

  muestraRuta(){
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
                coordinates: [this.marcadores[0].getLngLat().lng,this.marcadores[0].getLngLat().lat]
              }
            },
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [this.marcadores[1].getLngLat().lng,this.marcadores[1].getLngLat().lat]
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

    //console.log("muestraRuta() > ");
    //console.log(this.resRoute.routes[0].geometry);

    this.mapa.addLayer({
      id:'route',
      type:'line',
      source:{
        type:'geojson',
        data: this.resRoute.routes[0].geometry as unknown as GeoJSON.Geometry
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
}
