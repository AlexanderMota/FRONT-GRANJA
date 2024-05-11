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
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { ApiResponse } from 'src/app/models/apiResponse.model';


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
  
  @Input() 
  index:number = 0;
  @Input() 
  idTarea:string = "";

  mapa!:mapboxgl.Map;
  nuevaUbiActivo = false;
  verParadasActivo = false;
  eliminaParadaActivo = false;
  nombrePuntoPartida:string="";
  marcadores:mapboxgl.Marker[] = [];
  indicaciones: MapBoxLeg = new MapBoxLeg;

  @Output() 
  private eventoEmiteFormVehi = new EventEmitter<boolean>();
  @Output() 
  private eventoEmiteUbi = new EventEmitter<{nombre:string,lng:number,lat:number}>();
  @Output() 
  private eventoEmiteEliminaParada = new EventEmitter<{idUbicacion:string,fechasRecogida:{ fechaInicio: Date; fechaFin: Date; vehiculo: string}[]}>();
  @Output() 
  private eventoEmiteEditaParada = new EventEmitter<{idUbicacion:string,titulo:string,descripcion:string, longitud:number, latitud:number}>();
  
  private ubiCentro:UbicacionModel = new UbicacionModel();
  private medio : string = MediosTransporteMapBoxEnum.conduccion;
  private paradas : UbicacionModel[] = [];
  private clickHandlerVerRuta!: ((event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => void);
  private clickHandlerNuevaUbi!: ((event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => void);
  
  constructor(
    private actRoute:ActivatedRoute,
    private ubiServ: UbicacionService,
    private vehiServ: VehiculoService,
    private apiRespServ: ApiResponseService,
    private localizationService: LocalizationService) {

  }

  ngOnInit(): void {
  } 
  ngAfterViewInit(): void {
    this.iniciaMapa();
    this.muestraCentroTrabajo();
    this.clickMapaVerRutaActivo();
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

    this.mapa.on('load', () => {
      // Load an image from an external URL.
      this.mapa.loadImage('../../../assets/images/icons/parada.png', (error, image) => {
        if (error) console.log(error);
        this.mapa.addImage('parada', image!);
      });
    });
  }
  
  clickMapaVerRutaActivo(){
    this.mapa.on('click',this.clickHandlerVerRuta = event => {
      //console.log(event.lngLat);
      this.agregarMarcador(event.lngLat, true);
      this.ubiServ.getMapBoxRoute(this.medio, 
        [event.lngLat.lng,event.lngLat.lat],
        [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
        this.borraRuta();
        this.indicaciones = res.routes[0].legs[0];
        //console.log(this.indicaciones);
        this.pintaRuta(res.routes[0].geometry.coordinates);
      });
    });
  }
  clickMapaNuevaUbiActivo(){
    this.mapa.on('click',this.clickHandlerNuevaUbi = event => {
      //console.log(event.lngLat);
      this.agregarMarcador(event.lngLat, true);
      this.localizationService.getString("botones.cancelar").subscribe(btnCan =>  {
      this.localizationService.getString("botones.aceptar").subscribe(btnAcc => {
      this.localizationService.getString("mensajesInformacion.infoGuardarUbi").subscribe(msg => {
      this.localizationService.getString("encabezados.atencionTitulo").subscribe(tit => {
      this.apiRespServ.resMensajeQuesBtnCancBtn(tit,msg,btnAcc,true,btnCan).then(value => {
      if(value.isConfirmed){
        this.sendMessageFormUbi({nombre:this.nombrePuntoPartida,lng:event.lngLat.lng,lat:event.lngLat.lat});
      }})})})})});
    });
  }
  clickMapaEliminaUbiActivo(){
    this.mapa.on('click',/*this.clickHandler = */event => {
      console.log("elimina ubi por implementar: ");
      console.log(event);
    });
  }
  clickMapaInactivo(cli:((event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => void)){
    this.mapa.off('click',cli);
  }
  muestraCentroTrabajo(){
    this.actRoute.params.subscribe(async params=>{
      if(params['id']){
        await this.ubiServ.getUbiByIdTarea(
          localStorage.getItem('token')!,params['id'])
        .subscribe(async res=>{
          if(res instanceof ApiResponse){
            console.log(res.message);
          }else{
            this.ubiCentro=res[res.length - 1];
            if(this.ubiCentro){
              this.agregarMarcador({lng: this.ubiCentro.longitud,
                lat: this.ubiCentro.latitud}, false);
              this.vuelaUbi({lng:this.ubiCentro.longitud,
                lat:this.ubiCentro.latitud}, 17);
            }
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
      this.borraRuta();
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
          this.borraRuta();
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


            this.localizationService.getString("botones.cancelar").subscribe(btnCan =>  {
            this.localizationService.getString("botones.aceptar").subscribe(btnAcc => {
            this.localizationService.getString("encabezados.atencionTitulo").subscribe(tit => {
            this.localizationService.getString("mensajesInformacion.infoGuardaNuevaParada").subscribe(msg => {
            this.apiRespServ.resMensajeQuesBtnCancBtn(tit,msg, btnAcc, true, btnCan).then(value => {
              if(value.isConfirmed){
                //this.receiveNuevaUbi(false);
                this.sendMessageFormUbi(
                  {
                    nombre:this.nombrePuntoPartida,
                    lng:this.marcadores[this.marcadores.length-1].getLngLat().lng,
                    lat:this.marcadores[this.marcadores.length-1].getLngLat().lng
                  }
                );
              }
            })})})})});
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
  borraIndicaciones(){
    if (this.indicaciones.steps.length > 0) {
      this.indicaciones = new MapBoxLeg();
    }
  }

  pintaRuta(ruta:[]){
    
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
  pintaParadas(dat : UbicacionModel[]){
    for( let i = 0; i < dat.length; i++ ){
      // Add a layer to use the image to represent the data.
      this.mapa.addLayer({
        id: 'parada'+i.toString(),
        type: 'symbol',
        layout: {
            'icon-image': 'parada', // reference the image
            'icon-size': 0.085
        },
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [dat[i].longitud,dat[i].latitud]
                },
                properties: null
              }
            ]
          }
        }
      });
     /* this.mapa.addLayer({
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
                  coordinates: [dat[i].longitud,dat[i].latitud]
                }
              }
            ]
          }
        }
      });*/
    }
  }
  clickParadas(dat:UbicacionModel[]){
    for( let i = 0; i < dat.length; i++ ){
      this.mapa.on('click', 'parada'+i.toString(), (e) => {
        // Aquí puedes ejecutar la función que desees cuando se haga clic en la capa
        //console.log(e);
        //this.receiveNuevaUbi(this.nuevaUbiActivo);
        let btnResCad = "";
        let btnEliCad = "";
        let btnEdiCad = "";
        this.localizationService.getString("botones.eliminar").subscribe(btnEli =>  btnEliCad = btnEli);
        this.localizationService.getString("botones.reservar").subscribe(btnRes => btnResCad = btnRes);
        this.localizationService.getString("botones.editar").subscribe(btnEdi => btnEdiCad = btnEdi);
        //this.ubiServ.getMapBoxUbicacionByCoordenadas(e.lngLat).subscribe(res => {
          //console.log(res);
        const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat([dat[i].longitud,dat[i].latitud]).setHTML(
          `<h3 style="margin: 5px 0px 0px 0px; font-weith:bold;">${dat[i].titulo}</h3>
          <hr class="dropdown-divider" style="margin: 5px 0px;">
          <p style="margin: 5px 0px 15px 0px;">${dat[i].descripcion}</p>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <a class="boton1 btn btn-outline-info" style="padding: 6px 6px; width: 80px;">${btnResCad}</a>
            <a class="boton2 btn btn-outline-warning" style="padding: 6px 6px; width: 80px;">${btnEdiCad}</a>
            <a class="boton3 btn btn-outline-danger" style="padding: 6px 6px; width: 80px;">${btnEliCad}</a>
          </div>`
        ).addTo(this.mapa);
          //<div style="display: flex; flex-direction: row; justify-content: space-between;">
            //<a class="boton2 btn btn-outline-info">${btnResCad}</a>
          //</div>

        popup.setMaxWidth("280px");
        popup.getElement().style.cursor = 'default';
        popup.getElement().querySelector("button")!.style.width = "20px";
        popup.getElement().querySelector("button")!.style.cursor = "pointer";

      
        popup.getElement().querySelector(".boton1")!.addEventListener('click', () => {
          this.localizationService.getString("botones.cancelar").subscribe(btnCan =>  {
          this.localizationService.getString("botones.aceptar").subscribe(btnAcc => {
          this.localizationService.getString("mensajesInformacion.infoReservaPlaza").subscribe(msg => {
          this.localizationService.getString("encabezados.atencionTitulo").subscribe(tit => {
            let da: string[] = [];
            dat[i].fechasRecogida.forEach(val => {
              da.push(val.vehiculo + " - " + val.fechaInicio);
            });

            let index = 0;
            this.apiRespServ.resMensajeInputSelect(tit,msg,btnAcc, true, btnCan,da).then(value => {
              if(value){
                index = parseInt(value);
                //console.log(value);
                this.vehiServ.patchVehiculo(
                  localStorage.getItem('token')!,
                  dat[i].fechasRecogida[index].vehiculo,
                  localStorage.getItem('miid')!
                ).subscribe(res => {
                    console.log(res.status + " - " + res.message);
                    if(res.status == 200){
                      this.apiRespServ.resMensajeSucBtn(res.message);
                    }else{
                      this.apiRespServ.resMensajeErrBtn(res.message);
                    };
                  }
                );
              }
            }).catch(err=>console.log(err));
          })})})});
        });
        popup.getElement().querySelector(".boton2")!.addEventListener('click', () => {
          //console.log("idUbicacion: "+dat[i]._id);
          this.eventoEmiteEditaParada.emit({idUbicacion:dat[i]._id,titulo:dat[i].titulo,descripcion: dat[i].descripcion, longitud:dat[i].longitud, latitud:dat[i].latitud});
        });
        popup.getElement().querySelector(".boton3")!.addEventListener('click', () => {
          //console.log("idUbicacion: "+dat[i]._id);
          this.eventoEmiteEliminaParada.emit({idUbicacion:dat[i]._id,fechasRecogida:dat[i].fechasRecogida});
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
        this.borraRuta();
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
        this.borraRuta();
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
        this.borraRuta();
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
    /*let dat = [[0,0]
      [-0.4243583587732189,38.42475742385676],
      [-0.4306459479518594,38.41862525328767],
      [-0.43286969841986433,38.398432379976356]
    ]
    //644d82e1c7ea3f680d292941 6450bc74fb1155458be8b170*/

    if($event){
      //this.clickMapaVerRutaActivo();
      this.ubiServ.getUbiParadasDisp(
        localStorage.getItem('token')!, 
        localStorage.getItem('centroActual')!).subscribe(res=>{

        if((res as ApiResponse).status){
          console.log((res as ApiResponse).message);
          this.borraRuta();
          this.borraIndicaciones();
          this.borraMarcadorClick();
          //this.clickMapaVerRutaActivo();
        }else{ 
          this.borraRuta();
          this.borraIndicaciones();
          this.borraMarcadorClick();
          this.clickMapaInactivo(this.clickHandlerVerRuta);
          this.clickMapaInactivo(this.clickHandlerNuevaUbi);
          this.paradas = res as UbicacionModel[];
          this.pintaParadas(this.paradas);
          this.clickParadas(this.paradas);
        }
      });
    }else{
      this.ocultaParadas(this.paradas.length);
    }
  }
  receiveNuevaUbi($event: boolean){
    this.nuevaUbiActivo = $event;
    this.borraRuta();
    this.borraIndicaciones();
    this.borraMarcadorClick();
    if($event){
      this.borraIndicaciones();
      this.clickMapaInactivo(this.clickHandlerVerRuta);
      this.clickMapaNuevaUbiActivo();
    }else{
      this.clickMapaInactivo(this.clickHandlerNuevaUbi);
      this.clickMapaVerRutaActivo(); 
    }
    //this.indicaciones = new MapBoxLeg;
    //this.eliminaParadaActivo = false;
    //console.log($event);
  }
  /*receiveEliminaParada($event: boolean){
    this.eliminaParadaActivo = $event;
    this.borraRuta();
    this.borraMarcadorClick();
    //this.clickMapaInactivo();
    this.clickMapaEliminaUbiActivo();
    this.nuevaUbiActivo = false;
  }*/
}
