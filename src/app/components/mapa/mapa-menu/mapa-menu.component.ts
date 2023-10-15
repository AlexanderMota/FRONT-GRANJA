import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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
  eventoEmite = new EventEmitter<boolean>();
  
  muestraMenu = false;

  constructor() { }

  ngOnInit(): void {
  }
  menuItems: MenuItem[] = [
    {
      ruta: '/mapas/fullscreen',
      nombre: 'Transportes'
    }, {
      ruta: '/mapas/zoom-range',
      nombre: 'Añade transporte'
    }
  ];
  muestraOcultaMenu(){
    this.muestraMenu = !this.muestraMenu;
  }
  muestraFormVehi(){
    this.muestraOcultaMenu();
    this.eventoEmite.emit(true);
  }
}
