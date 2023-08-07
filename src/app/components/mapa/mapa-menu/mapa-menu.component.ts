import { Component, OnInit } from '@angular/core';

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

  muestraMenu = false;

  constructor() { }

  ngOnInit(): void {
  }
  menuItems: MenuItem[] = [
    {
      ruta: '/mapas/fullscreen',
      nombre: 'Transportes'
    },
    {
      ruta: '/mapas/zoom-range',
      nombre: 'Añade transporte'
    }
  ];
  muestraOcultaMenu(){
    this.muestraMenu = !this.muestraMenu;
  }
}
