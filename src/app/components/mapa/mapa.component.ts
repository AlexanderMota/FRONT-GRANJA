import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { UbicacionService, EstilosMapBoxEnum, MediosTransporteMapBoxEnum } from 'src/app/services/ubicacion.service';
import { environment } from 'src/environments/environment';
import { MapBoxFeature } from 'src/app/models/mapBoxResponse.model';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit {

  //private vehiculos : VehiculoModel[] = [];
  @ViewChild('mapa') 
  divMapa!: ElementRef;
  
  @Output() 
  private eventoEmiteFormVehi = new EventEmitter<boolean>();

  @Input() 
  index:number = 0;
  @Input() 
  idTarea:string = "";

  mapa!:mapboxgl.Map;
  private ubiCentro:UbicacionModel = new UbicacionModel();
  private medio : string = MediosTransporteMapBoxEnum.conduccion;
  marcadores:mapboxgl.Marker[] = [];

  constructor( private actRoute:ActivatedRoute,
    private ubiServ: UbicacionService ) { }

  ngOnInit(): void {
    
  } 
  ngAfterViewInit(): void {
    this.iniciaMapa();
    this.muestraCentroTrabajo();
    this.clickMapaActivo();
  }

  private iniciaMapa(){
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: EstilosMapBoxEnum.Satélite,
      center: [-0.4904,38.3464], // starting position
      zoom: 10
    });
    // Agregar barra de navegación
    this.mapa.addControl(new mapboxgl.NavigationControl());
  }
  
  clickMapaActivo(){
    this.mapa.on('click', event => {
      this.agregarMarcador(event.lngLat, true);
      this.ubiServ.getMapBoxRoute(this.medio, 
        [event.lngLat.lng,event.lngLat.lat],
        [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
        this.pintaRuta(res.routes[0].geometry.coordinates);
      });
    });
  }

  muestraCentroTrabajo(){
    this.actRoute.params.subscribe(async params=>{
      if(params['id']){
        await this.ubiServ.getUbiByIdTarea(
          localStorage.getItem('token')!,params['id'])
        .subscribe(async res=>{
          this.ubiCentro=res[res.length - 1];
          if(this.ubiCentro){
            this.agregarMarcador({lng: this.ubiCentro.longitud,
              lat: this.ubiCentro.latitud}, false);
            this.vuelaUbi({lng:this.ubiCentro.longitud,
              lat:this.ubiCentro.latitud}, 17);
          }
        });
      }
    });
  }

  vuelaUbi({lng= 0 ,lat= 0},zoom=5){
    if(lng != 0 && lat != 0){

    }
    this.mapa.flyTo({
      center: [lng,lat],
      zoom:zoom
    });
  }

  agregarMarcador(coordenadas:{lng:number,lat:number},movil:boolean){
    if(this.marcadores[1]){
      this.marcadores[1].remove();
      this.marcadores.splice(1,1);
    }
    const color ='#xxxxxx'.replace(/x/g, y =>(Math.random()*16|0).toString(16));

    this.marcadores[this.marcadores.length]=
      new mapboxgl.Marker({
        draggable:movil,
        color:color
      }).setLngLat([coordenadas.lng,coordenadas.lat])
          .addTo(this.mapa);

    //agrega listener al marcador
    if(this.marcadores[1]){
      this.marcadores[this.marcadores.length-1].on('dragend', () => {
        const newLngLat = this.marcadores[this.marcadores.length-1].getLngLat();
        const nuevaLatitud = newLngLat.lat;
        const nuevaLongitud = newLngLat.lng;
        console.log('Latitud:', nuevaLatitud);
        console.log('Longitud:', nuevaLongitud);

        this.ubiServ.getMapBoxRoute(this.medio, 
          [this.marcadores[this.marcadores.length-1].getLngLat().lng,
          this.marcadores[this.marcadores.length-1].getLngLat().lat],
          [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
          this.pintaRuta(res.routes[0].geometry.coordinates);
        });
      });
    }
  }

  sendMessageFormVehi($event: boolean){
    this.eventoEmiteFormVehi.emit($event);
  }
  
  receiveMessageBuscaUbi($event: MapBoxFeature){
    this.agregarMarcador({lng:$event.center[0],lat:$event.center[1]},true);
    this.vuelaUbi({lng:$event.center[0],lat:$event.center[1]},17 );
    this.ubiServ.getMapBoxRoute(this.medio, 
      [$event.center[0],$event.center[1]],
      [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
      this.pintaRuta(res.routes[0].geometry.coordinates);
    });
  }
  pintaRuta(ruta:[]){

    if (this.mapa.getSource('route')) {
      this.mapa.removeLayer('route');
      this.mapa.removeSource('route');
    }

    this.mapa.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: ruta
          }
        }
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
  
  receiveMessageCambiaEstiloMapa($event: string){
    this.mapa.setStyle($event);
  }

  receiveMessageMedioTransporteMapa($event: string){
    this.medio = $event;
  }
}
