import { Component, OnInit } from '@angular/core';
import { SolicitudModel } from 'src/app/models/solicitud.model';
import { SolicitudService } from 'src/app/services/solicitud.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  titulo="Solicitudes";
  posttitulo="Lista de empleados interesados en tareas.";
  solicitudes:SolicitudModel[] = [];

  constructor(private solServ:SolicitudService) { }

  ngOnInit(): void {
    //console.log(this.auth.token);

    this.solServ.getAllSolicitudes(localStorage.getItem('token')!).subscribe(res=>{
      this.solicitudes = res;
      //console.log(this.solicitudes);
    });
  }

}
