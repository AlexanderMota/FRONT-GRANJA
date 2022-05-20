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

const routes: Routes = [
  { path: 'home', component: HomeComponent , canActivate: [ AuthGuard ]},

  { path: 'tareas', component: TareasComponent , canActivate: [ AuthGuard ]},
  { path: 'tarea/nueva', component: TareaComponent , canActivate: [ AuthGuard ]},

  { path: 'empleados', component: EmpleadosComponent , canActivate: [ AuthGuard ]},

  { path: 'solicitudes', component: SolicitudesComponent , canActivate: [ AuthGuard ]},
  { path: 'solicitud/:id', component: SolicitudComponent , canActivate: [ AuthGuard ] },

  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },

  { path: '**', component: HomeComponent , canActivate: [ AuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
