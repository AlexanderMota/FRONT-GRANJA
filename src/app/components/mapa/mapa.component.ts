import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit {

  //private vehiculos : VehiculoModel[] = [];
  @ViewChild('mapa') divMapa!: ElementRef;
  ubi:UbicacionModel = new UbicacionModel();

  @Input() index:number = 0;
  @Input() idTarea:string = "F";
  private mapa!:mapboxgl.Map;
  marcadores:mapboxgl.Marker[] = [];

  constructor(
    private actRoute:ActivatedRoute,
    private ubiServ: UbicacionService) { 

    //console.log("idTarea1: " + this.ubi.idTarea +this.index);
  }
  ngOnInit(): void {
      this.actRoute.params.subscribe(async params=>{
        if(params['id']){
          console.log("mapa: "+params['id']);
          await this.ubiServ.getUbiByIdTarea(localStorage.getItem('token')!,params['id'])
          .subscribe(async res=>{
            console.log("mapa: "+res);
            this.ubi=res[res.length - 1];
            if(this.ubi){
              this.agregarMarcadorAuto({lng:this.ubi.longitud,lat:this.ubi.latitud});
              this.vuelaUbi({lng:this.ubi.longitud,lat:this.ubi.latitud},17);
            }
          });
        }
      });
    //console.log("idTarea2: " + this.ubi.idTarea+this.index);
    
  } 
  /*ngOnChanges() {
    if(this.ubi.latitud > 0){
    }
    this.vuelaUbi({lng:this.ubi.longitud,lat:this.ubi.latitud});38.4136547,-0.5157158
    //console.log("idTarea4: " + this.ubi.descripcion +"/"+this.idTarea);38.4179851,-0.4134316
  }*/
  
  vuelaUbi({lng= 0 ,lat= 0},zoom=5){
    if(lng != 0 && lat != 0){

    }
    this.mapa.flyTo({
      center: [lng,lat],
      zoom:zoom
    });
  }
  ngAfterViewInit(): void {
    //console.log("---ngAfterViewInit: " + this.ubi.idTarea+"/"+this.index);
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-0.4904,38.3464], // starting position
      zoom: 10
    });

    
    
  }
  agregarMarcadorAuto({lng=0.0,lat=0.0}){
    const color ='#xxxxxx'.replace(/x/g, y =>(Math.random()*16|0).toString(16));
    
    this.divMapa

    this.marcadores.push(
      new mapboxgl.Marker({
        draggable:false,
        color:color
      }).setLngLat([lng,lat])
          .addTo(this.mapa)
    );
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
  /*getIndicaciones(medio = "cycling",geometries = "geojson", puntoPartida = [0.0,0.0], puntoDestino = [0.0,0.0]):Observable<[any]> {
    medio += "/";
    return this.http.get<[any]>(this.mapboxUrl+medio+puntoPartida[0]+','+puntoPartida[1]+';'+puntoDestino[0]+','+puntoDestino[1], {
      params: {
        geometries:geometries,
        access_token:environment.mapboxToken
      }
    });
  }*/
}
