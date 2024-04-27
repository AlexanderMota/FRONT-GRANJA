import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { TareasComponent } from './pages/tareas/tareas.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component'
import { TareaComponent } from './pages/tarea/tarea.component';
import { GraficasComponent } from './graficos/graficas.component'
import { MapasComponent } from './mapas/mapas.component'
import { EmpleadoDetailsComponent } from './components/empleado-details/empleado-details.component';
import { TransporteComponent } from './pages/transporte/transporte.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent , canActivate: [ AuthGuard ]},

  { path: 'tareas', component: TareasComponent , canActivate: [ AuthGuard ]},
  { path: 'tareas/nueva', component: TareaComponent , canActivate: [ AuthGuard ]},
  { path: 'tarea/:id', component: TareaComponent , canActivate: [ AuthGuard ] },

  { path: 'empleados', component: EmpleadosComponent , canActivate: [ AuthGuard ]},
  { path: 'empleado/:id', component: EmpleadoDetailsComponent , canActivate: [ AuthGuard ]},
  
  { path: 'transporte', component: TransporteComponent , canActivate: [ AuthGuard ]},

  { path: 'solicitudes', component: SolicitudesComponent , canActivate: [ AuthGuard ]},
  { path: 'solicitud/:id', component: SolicitudComponent , canActivate: [ AuthGuard ] },

  { path: 'registro', component: RegistroComponent, canActivate: [ AuthGuard ] },
  { path: 'login', component: LoginComponent },
  
  { path: 'mapas', component:MapasComponent, loadChildren: () => import('./mapas/mapas.module').then(m => m.MapasModule ), canActivate: [ AuthGuard ] },
  { path: 'graficos', component:GraficasComponent, loadChildren: () => import('./graficos/graficos.module').then(m => m.GraficosModule ) , canActivate: [ AuthGuard ]},
  
  { path: '**', component: HomeComponent , canActivate: [ AuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
