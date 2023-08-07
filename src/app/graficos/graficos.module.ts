import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraficosRoutingModule } from './graficos-routing.module';
import { BarrasComponent } from './components/barras/barras.component';
import { BarrasDobleComponent } from './components/barras-doble/barras-doble.component';
import { DonaComponent } from './components/dona/dona.component';
import { DonaHttpComponent } from './components/dona-http/dona-http.component';
import { GraficaBarraComponent } from './pages/grafica-barra/grafica-barra.component';
import { MenuGraficasComponent } from './components/menu-graficas/menu-graficas.component';
import { GraficasComponent } from './graficas.component';


@NgModule({
  declarations: [
    BarrasComponent,
    BarrasDobleComponent,
    DonaComponent,
    DonaHttpComponent,
    GraficaBarraComponent,
    MenuGraficasComponent,
    GraficasComponent
  ],
  imports: [
    CommonModule,
    GraficosRoutingModule
  ]
})
export class GraficosModule { }
