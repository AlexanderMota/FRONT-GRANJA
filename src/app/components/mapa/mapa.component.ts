import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { UbicacionService, EstilosMapBoxEnum, MediosTransporteMapBoxEnum } from 'src/app/services/ubicacion.service';
import { environment } from 'src/environments/environment';
import { MapBoxFeature } from 'src/app/models/mapBoxResponse.model';
import { MapBoxLeg } from 'src/app/models/mapBoxRouteResponse.model';
import { MapaMenuComponent } from './mapa-menu/mapa-menu.component';
import { ApiResponseService } from 'src/app/services/api-response.service';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa') 
  divMapa!: ElementRef;
  @ViewChild(MapaMenuComponent)
  menu!: MapaMenuComponent;
  
  @Output() 
  private eventoEmiteFormVehi = new EventEmitter<boolean>();
  @Output() 
  private eventoEmiteUbi = new EventEmitter<{nombre:string,lng:number,lat:number}>();
  @Output()
  nuevaUbiActivo = false;
  
  @Input() 
  index:number = 0;
  @Input() 
  idTarea:string = "";

  mapa!:mapboxgl.Map;
  private clickHandler: any;
  private ubiCentro:UbicacionModel = new UbicacionModel();
  private medio : string = MediosTransporteMapBoxEnum.conduccion;
  marcadores:mapboxgl.Marker[] = [];
  nombrePuntoPartida:string="";
  indicaciones: MapBoxLeg = new MapBoxLeg;

  constructor(
    private actRoute:ActivatedRoute,
    private ubiServ: UbicacionService,
    private apiRespServ: ApiResponseService ) { }

  ngOnInit(): void {
  } 
  ngAfterViewInit(): void {
    this.iniciaMapa();
    this.muestraCentroTrabajo();
    this.clickMapaActivo();
    this.clickMapaInactivo();
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
    this.clickHandler = this.mapa.on('click', event => {
      //console.log(event.lngLat);
      this.agregarMarcador(event.lngLat, true);
      if(!this.nuevaUbiActivo){
        this.ubiServ.getMapBoxRoute(this.medio, 
          [event.lngLat.lng,event.lngLat.lat],
          [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
          this.indicaciones = res.routes[0].legs[0];
          this.pintaRuta(res.routes[0].geometry.coordinates);
        });
      }else{
        this.apiRespServ.resMensajeSucBtnCancBtn("ATENCIÓN",
          "¿Seguro que desea guardar esta ubicación? Tenga en cuenta que se compromete a acudir los días y horas que indique.", 
          "Aceptar", true, "Volver").then(value => {
            if(value.isConfirmed){
              //this.receiveNuevaUbi(false);
              this.sendMessageFormUbi({nombre:this.nombrePuntoPartida,lng:event.lngLat.lng,lat:event.lngLat.lat});
            }
          }
        );
        /*if(){
          this.apiRespServ.resMensajeInputDate();
        }*/
      }
    });
  }
  clickMapaInactivo(){
    this.mapa.off('click', this.clickHandler);
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
    /*if(lng != 0 && lat != 0){

    }*/
    this.mapa.flyTo({
      center: [lng,lat],
      zoom:zoom
    });
  }

  borraMarcadorClick(){
    if(this.marcadores[1]){

      this.marcadores[1].remove();
      this.marcadores.splice(1,1);
    }
  }
  agregarMarcador(coordenadas:{lng:number,lat:number},movil:boolean){
    if(this.marcadores[1]){ 
      this.borraMarcadorClick();
    }else if(this.marcadores.length == 1){
      this.menu.clickNuevoMarcador();
    }
    const color ='#xxxxxx'.replace(/x/g, y =>(Math.random()*16|0).toString(16));

    this.marcadores[this.marcadores.length]=
      new mapboxgl.Marker({
        draggable:movil,
        color:color
      }).setLngLat([coordenadas.lng,coordenadas.lat])
          .addTo(this.mapa);

    //agrega listener al marcador y +
    if(this.marcadores[1] && !this.nuevaUbiActivo){
      this.marcadores[this.marcadores.length-1].on('dragend', () => {
        this.ubiServ.getMapBoxRoute(this.medio, 
          [this.marcadores[this.marcadores.length-1].getLngLat().lng,
          this.marcadores[this.marcadores.length-1].getLngLat().lat],
          [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
          this.indicaciones = res.routes[0].legs[0];
          this.pintaRuta(res.routes[0].geometry.coordinates);
        });
        this.ubiServ.getMapBoxUbicacionByCoordenadas(
          {lng:this.marcadores[this.marcadores.length-1].getLngLat().lng,
          lat:this.marcadores[this.marcadores.length-1].getLngLat().lat}
        ).subscribe( res => {
          if(res.features[0]){
            this.nombrePuntoPartida = res.features[0].place_name;
          }else this.nombrePuntoPartida = "";
        });
      });

      this.ubiServ.getMapBoxUbicacionByCoordenadas(
        {lng:this.marcadores[this.marcadores.length-1].getLngLat().lng,
        lat:this.marcadores[this.marcadores.length-1].getLngLat().lat}
      ).subscribe( res => {
        if(res.features[0]){
          this.nombrePuntoPartida = res.features[0].place_name;
        }else this.nombrePuntoPartida = "";
      });
    }else if(this.marcadores[1] && this.nuevaUbiActivo){
      this.marcadores[this.marcadores.length-1].on('dragend', () => {
        this.ubiServ.getMapBoxUbicacionByCoordenadas(
          {lng:this.marcadores[this.marcadores.length-1].getLngLat().lng,
          lat:this.marcadores[this.marcadores.length-1].getLngLat().lat}
        ).subscribe( res => {
          if(res.features[0]){
            this.nombrePuntoPartida = res.features[0].place_name;
            this.apiRespServ.resMensajeSucBtnCancBtn("ATENCIÓN",
              "¿Seguro que desea guardar esta ubicación? Tenga en cuenta que se compromete a acudir los días y horas que indique.", 
              "Aceptar", true, "Volver").then(value => {
                if(value.isConfirmed){
                  this.receiveNuevaUbi(false);
                  this.sendMessageFormUbi(
                    {
                      nombre:this.nombrePuntoPartida,
                      lng:this.marcadores[this.marcadores.length-1].getLngLat().lng,
                      lat:this.marcadores[this.marcadores.length-1].getLngLat().lng
                    }
                  );
                }
              }
            );
          }else { 
            this.nombrePuntoPartida = "";
          }
        });
      });
      
      this.ubiServ.getMapBoxUbicacionByCoordenadas(
        {lng:this.marcadores[this.marcadores.length-1].getLngLat().lng,
        lat:this.marcadores[this.marcadores.length-1].getLngLat().lat}
      ).subscribe( res => {
        if(res.features[0]){
          this.nombrePuntoPartida = res.features[0].place_name;
        }else this.nombrePuntoPartida = "";
      });
    }
  }
  

  borraRuta(){
    if (this.mapa.getSource('route')) {
      this.mapa.removeLayer('route');
      this.mapa.removeSource('route');
    }
  }

  pintaRuta(ruta:[]){
    this.borraRuta();
    
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
  ocultaParadas(dat : number){
    for( let i = 0; i < dat; i++ ){
      this.mapa.removeLayer('parada'+i.toString());
      this.mapa.removeSource('parada'+i.toString());
    }
  }
  pintaParadas(dat : number[][]){
    for( let i = 0; i < dat.length; i++ ){
      this.mapa.addLayer({
        id: 'parada'+i.toString(),
        type: 'circle',
        paint:{
          'circle-radius': 10,
          'circle-color': 'rgba(55,148,179,1)'
        },
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
                  coordinates: [dat[i][0],dat[i][1]]
                }
              }
            ]
          }
        }
      });

      this.mapa.on('click', 'parada'+i.toString(), (e) => {
        // Aquí puedes ejecutar la función que desees cuando se haga clic en la capa
        console.log('Se hizo clic en la capa ' + 'parada'+i.toString());
        //console.log(e);

        this.ubiServ.getMapBoxUbicacionByCoordenadas(e.lngLat).subscribe(res => {
          //console.log(res);
          const popup = new mapboxgl.Popup({ offset: [0, -15] })
            .setLngLat(e.lngLat)
            .setHTML(
              `<h3>${res.features[0].text}</h3><p>${res.features[0].place_name}</p>`
            )
            .addTo(this.mapa);

            popup.getElement().addEventListener('click', () => {
              console.log("click popup: "+res.features[0].text);
            });
            popup.getElement().style.cursor = 'pointer';
        });
      });





    }
  }
  
  sendMessageFormVehi($event: boolean){
    this.eventoEmiteFormVehi.emit($event);
  }
  sendMessageFormUbi(even: {nombre:string,lng:number,lat:number}){
    this.eventoEmiteUbi.emit(even);
  }

  receiveMessageBuscaUbi($event: MapBoxFeature){
    this.agregarMarcador({lng:$event.center[0],lat:$event.center[1]},true);
    this.vuelaUbi({lng:$event.center[0],lat:$event.center[1]},17 );
    if(!this.nuevaUbiActivo){
      this.ubiServ.getMapBoxRoute(this.medio, 
      [$event.center[0],$event.center[1]],
      [this.ubiCentro.longitud,this.ubiCentro.latitud])
      .subscribe(res => {
        this.indicaciones = res.routes[0].legs[0];
        this.pintaRuta(res.routes[0].geometry.coordinates);
      });
    }
  }
  receiveMessageCambiaEstiloMapa($event: string){
    this.mapa.setStyle($event);
    if(this.marcadores.length > 1){
      this.ubiServ.getMapBoxRoute(this.medio, 
        [this.marcadores[this.marcadores.length-1].getLngLat().lng,
        this.marcadores[this.marcadores.length-1].getLngLat().lat],
        [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
        this.indicaciones = res.routes[0].legs[0];
        this.pintaRuta(res.routes[0].geometry.coordinates);
      });
    }
  }

  receiveMessageMedioTransporteMapa($event: string){
    this.medio = $event;
    if(this.marcadores.length > 1){
      this.ubiServ.getMapBoxRoute(this.medio, 
        [this.marcadores[this.marcadores.length-1].getLngLat().lng,
        this.marcadores[this.marcadores.length-1].getLngLat().lat],
        [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
        this.indicaciones = res.routes[0].legs[0];
        this.pintaRuta(res.routes[0].geometry.coordinates);
      });
    }
  }
  receiveReiniciaMapa($event: boolean){
    if($event){
      this.ngAfterViewInit();
    }
  }
  receiveVerTransportes($event: boolean){
    let dat = [[0,0]
      /*[-0.4243583587732189,38.42475742385676],
      [-0.4306459479518594,38.41862525328767],
      [-0.43286969841986433,38.398432379976356]*/
    ]
    
    //644d82e1c7ea3f680d292941 6450bc74fb1155458be8b170
    this.ubiServ.getUbiParadasDisp(localStorage.getItem('token')!, localStorage.getItem('centroActual')!).subscribe(res=>{
      res.forEach(res =>{
        /*console.log(res.titulo);
        console.log(res.longitud);
        console.log(res.latitud);*/
        dat.push([res.longitud,res.latitud])
      });
      console.log(dat.length);

      if($event){
        this.ocultaParadas(dat.length);
      }else{
        this.pintaParadas(dat);
      }
    });

    
  }
  receiveNuevaUbi($event: boolean){
    this.nuevaUbiActivo = $event;
      this.borraRuta();
      this.borraMarcadorClick();
      this.indicaciones = new MapBoxLeg;
    //console.log($event);
  }
}
