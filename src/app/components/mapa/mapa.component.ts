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
import { makeArray } from 'jquery';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa') 
  private divMapa!: ElementRef;
  @ViewChild(MapaMenuComponent)
  menu!: MapaMenuComponent;
  
  @Input() 
  index:number = 0;
  @Input() 
  tareaNuevaUbi = false;

  nuevaUbiActivo = false;
  nombrePuntoPartida:string="";
  indicaciones: MapBoxLeg = new MapBoxLeg;

  @Output() 
  private eventoEmiteFormVehi = new EventEmitter<boolean>();
  @Output() 
  private eventoEmiteUbi = new EventEmitter<{nombre:string,lng:number,lat:number}>();
  @Output() 
  private eventoEmiteEliminaParada = new EventEmitter<{idUbicacion:string,fechasRecogida:{ fechaInicio: Date; fechaFin: Date; vehiculo: string}[]}>();
  @Output() 
  private eventoEmiteEditaParada = new EventEmitter<{idUbicacion:string,titulo:string,descripcion:string, longitud:number, latitud:number}>();
  
  private mapa!:mapboxgl.Map;
  private marcCentro: mapboxgl.Marker = new mapboxgl.Marker;
  private marcUsuario: mapboxgl.Marker = new mapboxgl.Marker;
  private ubiCentro:UbicacionModel = new UbicacionModel();
  private medio : string = MediosTransporteMapBoxEnum.conduccion;
  private paradas : UbicacionModel[] = [];
  private clickHandlersParadas: { [key: string]: (e: any) => void } = {};
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
    this.borraIndicaciones();
  } 
  ngAfterViewInit(): void {
    this.clickParadasOff();
    this.ocultaParadas(this.paradas.length);
    this.paradas = [];

    this.iniciaMapa();
    this.muestraCentroTrabajo();
    this.clickMapaVerRutaActivo();
  }

  private iniciaMapa(){
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: EstilosMapBoxEnum.Satélite,
      center: [-0.4904,38.3464],
      zoom: 10
    }); 
    this.mapa.addControl(new mapboxgl.NavigationControl());

    this.mapa.on('load', () => {
      this.mapa.loadImage('../../../assets/images/icons/parada.png', (error, image) => {
        if (error) console.log(error);
        this.mapa.addImage('parada', image!);
      });
    });

  }
  
  private clickMapaVerRutaActivo(){
    this.mapa.on('click',this.clickHandlerVerRuta = event => {
      this.marcUsuario.remove();
      this.borraRuta();
      this.agregarMarcador(event.lngLat.lng, event.lngLat.lat, true);
      this.ubiServ.getMapBoxRoute(this.medio, 
        [event.lngLat.lng,event.lngLat.lat],
        [this.ubiCentro.longitud,this.ubiCentro.latitud])
      .subscribe(res => {
        this.nombrePuntoPartida = res.routes[0].legs[0].summary;
        this.indicaciones = res.routes[0].legs[0];
        this.pintaRuta(res.routes[0].geometry.coordinates);
        this.menu.clickNuevoMarcador();
      });
    });
  }
  private clickMapaNuevaUbiActivo(){
    this.mapa.on('click',this.clickHandlerNuevaUbi = event => {
      this.marcUsuario.remove();
      this.agregarMarcador(event.lngLat.lng, event.lngLat.lat, true);
      if(this.tareaNuevaUbi){
        this.localizationService.getString("botones.cancelar").subscribe(btnCan =>  {
        this.localizationService.getString("botones.aceptar").subscribe(btnAcc => {
        this.localizationService.getString("mensajesInformacion.infoGuardarUbi").subscribe(msg => {
        this.localizationService.getString("encabezados.atencionTitulo").subscribe(tit => {
        this.apiRespServ.resMensajeQuesBtnCancBtn(tit,msg,btnAcc,true,btnCan).then(value => {
        if(value.isConfirmed){
          this.sendMessageFormUbi({nombre:this.nombrePuntoPartida,lng:event.lngLat.lng,lat:event.lngLat.lat});
        }})})})})});
      }else{
        this.localizationService.getString("botones.cancelar").subscribe(btnCan =>  {
        this.localizationService.getString("botones.aceptar").subscribe(btnAcc => {
        this.localizationService.getString("mensajesInformacion.infoGuardarParada").subscribe(msg => {
        this.localizationService.getString("encabezados.atencionTitulo").subscribe(tit => {
        this.apiRespServ.resMensajeQuesBtnCancBtn(tit,msg,btnAcc,true,btnCan).then(value => {
        if(value.isConfirmed){
          this.sendMessageFormUbi({nombre:this.nombrePuntoPartida,lng:event.lngLat.lng,lat:event.lngLat.lat});
        }})})})})});
      }
    });
  }
  private clickMapaInactivo(cli:((event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => void)){ this.mapa.off('click',cli) }
  private muestraCentroTrabajo(){
    this.actRoute.params.subscribe(async params=>{
      if(params['id']){
        await this.ubiServ.getUbiByIdTarea(
          localStorage.getItem('token')!,params['id'])
        .subscribe({next:async res=>{
          if((res as ApiResponse).status){
            console.log((res as ApiResponse).message);
          }else{
            console.log(res);
            this.ubiCentro=(res as UbicacionModel[])[0];
            if(this.ubiCentro){
              this.borraRuta();
              this.marcCentro.remove();
              this.marcUsuario.remove();
              this.agregaMarcadorCentro(this.ubiCentro.longitud,
                this.ubiCentro.latitud);
              this.vuelaUbi({lng:this.ubiCentro.longitud,
                lat:this.ubiCentro.latitud}, 17);
            }
          }
        },error:err=>{
          if(err.status == 420) this.apiRespServ.resMensajeWrnBtnRedir("sesión expirada: " + err.message,"tareas");
        }});
      }
    });
  }

  private vuelaUbi({lng= 0 ,lat= 0},zoom=5){
    this.mapa.flyTo({
      center: [lng,lat],
      zoom:zoom
    });
  }

  private agregaMarcadorCentro(lng:number,lat:number){
    
    const color ='#xxxxxx'.replace(/x/g, y =>(Math.random()*16|0).toString(16));
    this.marcCentro = new mapboxgl.Marker({
      draggable:false,
      color:color
    }).setLngLat([
      lng,
      lat
    ]).addTo(this.mapa);
  }
  private agregarMarcador(lng:number,lat:number,movil:boolean){
    
    const color ='#xxxxxx'.replace(/x/g, y =>(Math.random()*16|0).toString(16));

    this.marcUsuario = new mapboxgl.Marker({
        draggable:movil,
        color:color
      }).setLngLat([
        lng,
        lat
      ]).addTo(this.mapa);

    if(this.marcUsuario && !this.nuevaUbiActivo){


      this.marcUsuario.on('dragend', () => {
        this.ubiServ.getMapBoxRoute(this.medio, 
          [this.marcUsuario.getLngLat().lng,
          this.marcUsuario.getLngLat().lat],
          [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
          this.borraRuta();
          this.borraIndicaciones();
          this.pintaRuta(res.routes[0].geometry.coordinates);
          this.indicaciones = res.routes[0].legs[0];
        });
        this.ubiServ.getMapBoxUbicacionByCoordenadas(
          {lng:this.marcUsuario.getLngLat().lng,
          lat:this.marcUsuario.getLngLat().lat}
        ).subscribe( res => {
          if(res.features[0]){
            this.nombrePuntoPartida = res.features[0].place_name;
          }else this.nombrePuntoPartida = "";
        });
      });

      this.ubiServ.getMapBoxUbicacionByCoordenadas(
        {lng:this.marcUsuario.getLngLat().lng,
      lat:this.marcUsuario.getLngLat().lat}
      ).subscribe( res => {
        if(res.features[0]){
          this.nombrePuntoPartida = res.features[0].place_name;
        }else this.nombrePuntoPartida = "";
      });

    }else if(this.marcUsuario && this.nuevaUbiActivo){


      this.marcUsuario.on('dragend', () => {
        this.ubiServ.getMapBoxUbicacionByCoordenadas(
          {lng:this.marcUsuario.getLngLat().lng,
          lat:this.marcUsuario.getLngLat().lat}
        ).subscribe( res => {
          if(res.features[0]){
            this.nombrePuntoPartida = res.features[0].place_name;


            this.localizationService.getString("botones.cancelar").subscribe(btnCan =>  {
            this.localizationService.getString("botones.aceptar").subscribe(btnAcc => {
            this.localizationService.getString("encabezados.atencionTitulo").subscribe(tit => {
            this.localizationService.getString("mensajesInformacion.infoGuardaNuevaParada").subscribe(msg => {
            this.apiRespServ.resMensajeQuesBtnCancBtn(tit,msg, btnAcc, true, btnCan).then(value => {
              if(value.isConfirmed){
                this.sendMessageFormUbi(
                  {
                    nombre:this.nombrePuntoPartida,
                    lng:this.marcUsuario.getLngLat().lng,
                    lat:this.marcUsuario.getLngLat().lng
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
        {lng:this.marcUsuario.getLngLat().lng,
        lat:this.marcUsuario.getLngLat().lat}
      ).subscribe( res => {
        if(res.features[0]){
          this.nombrePuntoPartida = res.features[0].place_name;
        }else this.nombrePuntoPartida = "";
        console.log(this.nombrePuntoPartida);
      });
    }
  }
  private borraRuta(){
    if (this.mapa.getSource('route')) {
      this.mapa.removeLayer('route');
      this.mapa.removeSource('route');
    }
  }
  private borraIndicaciones(){
    if (this.indicaciones.steps.length > 0) {
      this.indicaciones = new MapBoxLeg();
    }
  }

  private pintaRuta(ruta:[]){
    
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
  private ocultaParadas(dat : number){
    try{
      for( let i = 0; i < dat; i++ ){
        if(this.mapa.getSource('parada'+i.toString()) != undefined){
          console.log(this.mapa.getSource('parada'+i.toString()));
          console.log(this.mapa.getLayer('parada'+i.toString()));
          this.mapa.removeLayer('parada'+i.toString());
          this.mapa.removeSource('parada'+i.toString());
        }
      }
    }catch(err){
      console.log(err);
    }
  }
  private pintaParadas(dat : UbicacionModel[]){
    for( let i = 0; i < dat.length; i++ ){
      this.mapa.addLayer({
        id: 'parada'+i.toString(),
        type: 'symbol',
        layout: {
            'icon-image': 'parada', 
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
    }
  }
  private clickParadasOn(dat: UbicacionModel[]) {
    for (let i = 0; i < dat.length; i++) {
      const handler = () => {
        let btnResCad = "";
        let btnEdiCad = "";
        let btnEliCad = "";
        this.localizationService.getString("botones.reservar").subscribe(btnRes => btnResCad = btnRes);
        this.localizationService.getString("botones.editar").subscribe(btnEdi => btnEdiCad = btnEdi);
        this.localizationService.getString("botones.eliminar").subscribe(btnEli => btnEliCad = btnEli);

        const popup = new mapboxgl.Popup({ offset: [0, -15] })
          .setLngLat([dat[i].longitud, dat[i].latitud]).setHTML(
            `<h3 style="margin: 5px 0px 0px 0px; font-weith:bold;">${dat[i].titulo}</h3>
            <hr class="dropdown-divider" style="margin: 5px 0px;">
            <p style="margin: 5px 0px 15px 0px;">${dat[i].descripcion}</p>
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
              <a class="boton1 btn btn-outline-info" style="padding: 6px 6px; width: 80px;">${btnResCad}</a>
              <a class="boton2 btn btn-outline-warning" style="padding: 6px 6px; width: 80px;">${btnEdiCad}</a>
              <a class="boton3 btn btn-outline-danger" style="padding: 6px 6px; width: 80px;">${btnEliCad}</a>
            </div>`
          ).addTo(this.mapa);

        popup.setMaxWidth("280px");
        popup.getElement().style.cursor = 'default';
        popup.getElement().querySelector("button")!.style.width = "20px";
        popup.getElement().querySelector("button")!.style.cursor = "pointer";

        popup.getElement().querySelector(".boton1")!.addEventListener('click', () => {
          this.localizationService.getString("botones.cancelar").subscribe(btnCan => {
            this.localizationService.getString("botones.aceptar").subscribe(btnAcc => {
              this.localizationService.getString("mensajesInformacion.infoReservaPlaza").subscribe(msg => {
                this.localizationService.getString("encabezados.atencionTitulo").subscribe(tit => {
                  let da: string[] = [];
                  dat[i].fechasRecogida.forEach(val => {
                    da.push(val.vehiculo + " - " + val.fechaInicio);
                  });

                  let index = 0;
                  this.apiRespServ.resMensajeInputSelect(tit, msg, btnAcc, true, btnCan, da).then(value => {
                    if (value) {
                      index = parseInt(value);
                      this.vehiServ.patchVehiculo(
                        localStorage.getItem('token')!,
                        dat[i].fechasRecogida[index].vehiculo,
                        localStorage.getItem('miid')!
                      ).subscribe(res => {
                        if (res.status == 200) {
                          this.apiRespServ.resMensajeSucBtn(res.message);
                        } else {
                          this.apiRespServ.resMensajeErrBtn(res.message);
                        }
                      });
                    }
                  }).catch(err => console.log(err));
                })
              })
            })
          });
        });

        popup.getElement().querySelector(".boton2")!.addEventListener('click', () => {
          this.eventoEmiteEditaParada.emit({
            idUbicacion: dat[i]._id,
            titulo: dat[i].titulo,
            descripcion: dat[i].descripcion,
            longitud: dat[i].longitud,
            latitud: dat[i].latitud
          });
        });

        popup.getElement().querySelector(".boton3")!.addEventListener('click', () => {
          this.eventoEmiteEliminaParada.emit({
            idUbicacion: dat[i]._id,
            fechasRecogida: dat[i].fechasRecogida
          });
        });
      };

      const markerId = 'parada' + i.toString();
      this.mapa.on('click', markerId, handler);
      this.clickHandlersParadas[markerId] = handler;
    }
  }
  private clickParadasOff() {
    for (const [markerId, handler] of Object.entries(this.clickHandlersParadas)) {
      this.mapa.off('click', markerId, handler);
    }
    this.clickHandlersParadas = {};
  }
  sendMessageFormVehi($event: boolean){
    this.eventoEmiteFormVehi.emit($event);
  }
  private sendMessageFormUbi(even: {nombre:string,lng:number,lat:number}){
    this.eventoEmiteUbi.emit(even);
  }

  receiveMessageBuscaUbi($event: MapBoxFeature){
    this.borraRuta();
    this.marcUsuario.remove();
    this.marcCentro.remove();
    this.agregarMarcador($event.center[0],$event.center[1],true);
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
      this.ubiServ.getMapBoxRoute(this.medio, 
        [this.marcUsuario.getLngLat().lng,this.marcUsuario.getLngLat().lat],
        [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
        this.borraRuta();
        this.indicaciones = res.routes[0].legs[0];
        this.pintaRuta(res.routes[0].geometry.coordinates);
      });
  }

  receiveMessageMedioTransporteMapa($event: string){
    this.medio = $event;
      this.ubiServ.getMapBoxRoute(this.medio, 
        [this.marcUsuario.getLngLat().lng,this.marcUsuario.getLngLat().lat],
        [this.ubiCentro.longitud,this.ubiCentro.latitud]).subscribe(res => {
        this.borraRuta();
        this.indicaciones = res.routes[0].legs[0];
        this.pintaRuta(res.routes[0].geometry.coordinates);
      });
  }
  receiveReiniciaMapa($event: boolean){
    if($event){
      this.ngAfterViewInit();
    }
  }
  receiveVerTransportes($event: boolean){
    if($event){
      this.ubiServ.getUbiParadasDisp( localStorage.getItem('token')!, this.ubiCentro._id )
      .subscribe({next:res=>{
        if((res as ApiResponse).status){
          if((res as ApiResponse).status == 420)
          console.log((res as ApiResponse).message);
          this.borraRuta();
          this.borraIndicaciones();
          this.marcUsuario.remove();
        }else{ 
          if((res as UbicacionModel[]).length < 1) this.apiRespServ.resMensajeWrnBtn("Ningún compañero ha configurado una parada para esta tarea.");
          else{
            this.ocultaParadas(this.paradas.length);
            this.clickParadasOff();

            console.log(res);
            this.borraRuta();
            this.borraIndicaciones();
            this.marcUsuario.remove();
            this.paradas = res as UbicacionModel[];
            this.pintaParadas(this.paradas);
            this.clickParadasOn(this.paradas);
            this.clickMapaInactivo(this.clickHandlerVerRuta);
            this.clickMapaInactivo(this.clickHandlerNuevaUbi);
          }
        }
      },error:err=>{
        console.log(err);
        if(err.status == 420) this.apiRespServ.resMensajeWrnBtnRedir("sesión expirada: " + err.message,"tareas");
      }});
    }else{
      this.ocultaParadas(this.paradas.length);
    }
  }
  receiveNuevaUbi($event: boolean){
    this.nuevaUbiActivo = $event;
    this.borraRuta();
    this.borraIndicaciones();
    this.marcUsuario.remove();

    if($event){
      this.borraIndicaciones();
      this.clickMapaInactivo(this.clickHandlerVerRuta);
      this.clickMapaNuevaUbiActivo();
    }else{
      this.clickMapaInactivo(this.clickHandlerNuevaUbi);
      this.clickMapaVerRutaActivo(); 
    }
  }
}
