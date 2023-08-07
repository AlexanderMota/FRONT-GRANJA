import { Component, OnInit } from '@angular/core';

interface MenuItem  {
  ruta: string;
  nombre: string;
}

@Component({
  selector: 'app-menu-mapa',
  templateUrl: './menu-mapa.component.html',
  styles: [
    `
    li {
      cursor: pointer;
    }
    `
  ]
})
export class MenuMapaComponent {

  menuItems: MenuItem[] = [
    {
      ruta: '/mapas/fullscreen',
      nombre: 'FullScreen'
    },
    {
      ruta: '/mapas/zoom-range',
      nombre: 'Zoom Range'
    },
    {
      ruta: '/mapas/marcadores',
      nombre: 'Marcadores'
    },
    {
      ruta: '/mapas/propiedades',
      nombre: 'Propiedades'
    }
  ];

}
