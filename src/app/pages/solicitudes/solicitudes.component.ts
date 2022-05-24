import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudModel } from 'src/app/models/solicitud.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  titulo="Solicitudes";
  posttitulo="Lista de empleados interesados en tareas.";
  solicitudes:SolicitudModel[] = [];

  constructor(private solServ:SolicitudService,
          private router:Router,
          private auth:AuthService,
          private apiPop:ApiResponseService) { }

  ngOnInit(): void {
    //console.log(this.auth.token);

    this.solServ.getAllSolicitudes(localStorage.getItem('token')!).subscribe(res=>{
      this.solicitudes = res;
      //console.log(this.solicitudes);
    });

  }
  

}
