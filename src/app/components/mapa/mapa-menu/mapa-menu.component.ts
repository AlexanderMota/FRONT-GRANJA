import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapBoxResponseModel, MapBoxFeature } from 'src/app/models/mapBoxResponse.model';
import { MapBoxLeg } from 'src/app/models/mapBoxRouteResponse.model';
import { LocalizationService } from 'src/app/services/localization.service';
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
  eventoEmiteFormUbi = new EventEmitter<boolean>();
  @Output() 
  eventoEmiteCambiaUbi = new EventEmitter<boolean>();
  @Output() 
  eventoEmiteCambiaEstiloMapa = new EventEmitter<string>();
  @Output() 
  eventoEmiteMedioTransporteMapa = new EventEmitter<string>();
  @Output() 
  eventoEmiteReiniciaMapa = new EventEmitter<boolean>();
  @Output() 
  eventoEmiteVerTransportes = new EventEmitter<boolean>();
  
  @Input() 
  inputSearchValue: string = '';
  @Input()
  indicaciones: MapBoxLeg = new MapBoxLeg;
  @Input()
  nuevaUbi: boolean = false;
  //@Input()
  cambiaUbi: boolean = false;
  @Input()
  eliminaParada: boolean = false;

  resMapBox: MapBoxResponseModel = new MapBoxResponseModel;
  
  muestraBotonMenu = true;
  muestraMenu = false;
  muestraMenuEstilos = false;
  muestraBarraBusca = false;
  muestraParadas= false;
  estilosMapa = EstilosMapBoxEnum.getArray();
  estiloSelect = this.estilosMapa[5].url;
  mediosMapa = MediosTransporteMapBoxEnum.getArray();
  medioSelect = this.mediosMapa[1].clave;
  nuevaUbiCadena = "";
  paradaCadena = "";

  constructor(private ubiServ : UbicacionService,
    private localizationService: LocalizationService) { 
      this.localizationService.getString("botones.nuevaParada").subscribe(val => this.nuevaUbiCadena = val);
      this.localizationService.getString("botones.verParadas").subscribe(val => this.paradaCadena = val);
    }

  ngOnInit(): void {
  }
  menuItems: MenuItem[] = [
    {
      ruta: '/transporte',
      nombre: 'Transportes'
    }
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
  clickNuevoMarcador(){
    this.muestraBotonMenu = false;
    this.muestraMenu = false;
    this.muestraMenuEstilos = false;
    this.muestraBarraBusca = true;
  }
  buscaUbicacion(str:string){

    this.ubiServ.getMapBoxUbicacion(str)
    .subscribe(async res=>{
      this.resMapBox = res;
    });
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
    this.medioSelect = str;
    this.eventoEmiteMedioTransporteMapa.emit(str);
  }
  reiniciaMapa(){
    this.muestraOcultaMenu();
    this.inputSearchValue = '';
    this.indicaciones = new MapBoxLeg;
    this.eventoEmiteReiniciaMapa.emit(true);
  }
  sendVerTransportes(){
    this.muestraParadas = !this.muestraParadas;
    if(this.muestraParadas){
      this.localizationService.getString("botones.ocultaParadas").subscribe(val => this.paradaCadena = val);
    }else{
      this.localizationService.getString("botones.verParadas").subscribe(val => this.paradaCadena = val);
    }
    this.eventoEmiteVerTransportes.emit(this.muestraParadas);
  }
  activaNuevaUbi(){
    this.cambiaUbi = false;
    this.nuevaUbi = !this.nuevaUbi;
    if(this.nuevaUbi){
      this.localizationService.getString("botones.navegacion").subscribe(val => this.nuevaUbiCadena = val);
    }else{
      this.localizationService.getString("botones.nuevaParada").subscribe(val => this.nuevaUbiCadena = val);
    }
    this.eventoEmiteFormUbi.emit(this.nuevaUbi);
  }
  activaCambiaUbi(){
    this.nuevaUbi = false;
    this.cambiaUbi = !this.cambiaUbi;
    if(this.cambiaUbi){
      this.localizationService.getString("botones.navegacion").subscribe(val => this.nuevaUbiCadena = val);
    }else{
      this.localizationService.getString("botones.nuevaParada").subscribe(val => this.nuevaUbiCadena = val);
    }
    this.eventoEmiteCambiaUbi.emit(this.cambiaUbi);
  }
}
