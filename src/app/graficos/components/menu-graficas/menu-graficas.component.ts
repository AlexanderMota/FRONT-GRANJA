import { Component, OnInit } from '@angular/core';

interface MenuItem {
  ruta: string;
  texto: string;
}

@Component({
  selector: 'app-menu-graficas',
  templateUrl: './menu-graficas.component.html',
  styles: [
  ]
})
export class MenuGraficasComponent {

  menu: MenuItem[] = [
    { ruta:'/graficos/barras', texto:'Barras'},
    { ruta:'/graficos/barrasdoble', texto:'Barras dobles' },
    { ruta:'/graficos/dona', texto:'Dona'},
    { ruta:'/graficos/donah', texto:'Dona Http' },
  ];

  constructor() { }

}
