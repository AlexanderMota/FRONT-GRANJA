import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {BarrasComponent} from './components/barras/barras.component';
import {BarrasDobleComponent} from './components/barras-doble/barras-doble.component';
import {DonaComponent} from './components/dona/dona.component'
import {DonaHttpComponent} from './components/dona-http/dona-http.component'

const routes: Routes = [{
  path:'',
  children:[
    { path:'barras', component: BarrasComponent },
    { path:'barrasdoble', component: BarrasDobleComponent },
    { path:'dona', component: DonaComponent },
    { path:'donah', component: DonaHttpComponent },
    { path:'**', redirectTo: '/graficos' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraficosRoutingModule { }