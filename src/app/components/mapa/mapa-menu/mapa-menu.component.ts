import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapBoxResponseModel, MapBoxFeature } from 'src/app/models/mapBoxResponse.model';
import { MapBoxLeg } from 'src/app/models/mapBoxRouteResponse.model';
import { UbicacionService, EstilosMapBoxEnum, MediosTransporteMapBoxEnum } from 'src/app/services/ubicacion.service';

interface MenuItem  {
  ruta: string;
  nombre: string;
}

@Component({
  selector: 'app-mapa-menu',
  templateUrl: './mapa-menu.component.html',
  styleUrls: ['./mapa-menu.component.css']
})
export class MapaMenuComponent {

  @Output() 
  eventoEmiteFormVehi = new EventEmitter<boolean>();
  @Output() 
  eventoEmiteBuscaUbi = new EventEmitter<MapBoxFeature>();
  @Output() 
  eventoEmiteCambiaEstiloMapa = new EventEmitter<string>();
  @Output() 
  eventoEmiteMedioTransporteMapa = new EventEmitter<string>();
  @Output() 
  eventoEmiteReiniciaMapa = new EventEmitter<boolean>();
  
  @Input() 
  inputSearchValue: string = '';
  @Input()
  indicaciones: MapBoxLeg = new MapBoxLeg;

  resMapBox: MapBoxResponseModel = new MapBoxResponseModel;
  
  muestraBotonMenu = true;
  muestraMenu = false;
  muestraMenuEstilos = false;
  muestraBarraBusca = false;
  //muestraIndicaciones = false;
  estilosMapa = EstilosMapBoxEnum.getArray();
  estiloSelect = this.estilosMapa[5].url;
  mediosMapa = MediosTransporteMapBoxEnum.getArray();
  medioSelect = this.mediosMapa[1].clave;

  constructor(private ubiServ : UbicacionService) { }

  ngOnInit(): void {
  }
  menuItems: MenuItem[] = [
    {
      ruta: '/mapas/fullscreen',
      nombre: 'Transportes'
    }/*, {
      ruta: '/mapas/zoom-range',
      nombre: 'Añade transporte'
    }*/
  ];
  muestraOcultaMenu(){
    this.muestraMenu = !this.muestraMenu;
    this.muestraBotonMenu = !this.muestraBotonMenu;
  }
  muestraOcultaBarraBusca(){
    this.muestraMenu = !this.muestraMenu;
    this.muestraBarraBusca = !this.muestraBarraBusca;
    this.resMapBox = new MapBoxResponseModel;
  }
  muestraOcultaMenuEstilos(){
    this.muestraMenu = !this.muestraMenu;
    this.muestraMenuEstilos = !this.muestraMenuEstilos;
  }
  muestraFormVehi(){
    this.muestraOcultaMenu();
    this.eventoEmiteFormVehi.emit(true);
  }
  buscaUbicacion(str:string){
    //console.log("barra busca envia: "+str);

    this.ubiServ.getMapBoxUbicacion(str)
    .subscribe(async res=>{
      this.resMapBox = res;
    });
    //this.muestraIndicaciones = true;
  }
  clickOcurrenciaUbi($event: MapBoxFeature){
    this.resMapBox = new MapBoxResponseModel;
    this.inputSearchValue = $event.place_name;
    this.eventoEmiteBuscaUbi.emit($event);
  }
  sendEstiloMapa(str:string){
    this.estiloSelect = str;
    this.eventoEmiteCambiaEstiloMapa.emit(str);
  }
  sendMedioTransporteMapa(str:string){
    this.eventoEmiteMedioTransporteMapa.emit(str);
    this.medioSelect = str;
  }
  reiniciaMapa(){
    this.muestraOcultaMenu();
    this.inputSearchValue = '';
    this.indicaciones = new MapBoxLeg;
    this.eventoEmiteReiniciaMapa.emit(true);
  }
  muestraPuntosDeRecogida(){
    console.log("por hacer");
  }
}
