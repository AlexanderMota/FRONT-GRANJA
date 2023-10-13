import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Routes
import { AppRoutingModule } from './app-routing.module'

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TareaCardComponent } from './components/tarea-card/tarea-card.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { EmpleadoCardComponent } from './components/empleado-card/empleado-card.component';
import { SolicitudCardComponent } from './components/solicitud-card/solicitud-card.component';
import { TareaFormComponent } from './components/tarea-form/tarea-form.component';
import { TareaDetailsComponent } from './components/tarea-details/tarea-details.component';
import { EmpleadoLineaComponent } from './components/empleado-linea/empleado-linea.component';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { TareasComponent } from './pages/tareas/tareas.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { TareaComponent } from './pages/tarea/tarea.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';
import { EmpleadoDetailsComponent } from './components/empleado-details/empleado-details.component';
import { EmpleadoDetailComponent } from './components/empleado-detail/empleado-detail.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { SubtareaComponent } from './components/subtarea/subtarea.component';
import { MapaMenuComponent } from './components/mapa/mapa-menu/mapa-menu.component';
import { TransportesFormComponent } from './components/transportes-form/transportes-form.component';
import { TransporteComponent } from './pages/transporte/transporte.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    TareasComponent,
    ComentariosComponent,
    EmpleadosComponent,
    SolicitudesComponent,
    TareaCardComponent,
    EmpleadoCardComponent,
    SolicitudCardComponent,
    TareaComponent,
    SolicitudComponent,
    TareaFormComponent,
    TareaDetailsComponent,
    EmpleadoLineaComponent,
    EmpleadoDetailsComponent,
    EmpleadoDetailComponent,
    MapaComponent,
    UbicacionComponent,
    SubtareaComponent,
    MapaMenuComponent,
    TransportesFormComponent,
    TransporteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
