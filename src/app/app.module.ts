import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Routes
import { AppRoutingModule } from './app-routing.module'

// Services

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TareaCardComponent } from './components/tarea-card/tarea-card.component';
import { EmpleadoCardComponent } from './components/empleado-card/empleado-card.component';
import { SolicitudCardComponent } from './components/solicitud-card/solicitud-card.component';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { TareasComponent } from './pages/tareas/tareas.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { TareaComponent } from './pages/tarea/tarea.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';
import { TareaFormComponent } from './components/tarea-form/tarea-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    TareasComponent,
    EmpleadosComponent,
    SolicitudesComponent,
    TareaCardComponent,
    EmpleadoCardComponent,
    SolicitudCardComponent,
    TareaComponent,
    SolicitudComponent,
    TareaFormComponent
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
