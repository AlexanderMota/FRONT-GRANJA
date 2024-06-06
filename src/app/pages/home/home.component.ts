import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { EstadisticaService } from 'src/app/services/estadistica.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'/*,
  styleUrls: ['./home.component.css']*/
})
export class HomeComponent implements OnInit {

  //estDatos : { time: string , value :number }[] = [];

  constructor(private authServ: AuthService,
    private respServ:ApiResponseService,
    private estServ: EstadisticaService ) {

  }
  ngOnInit(): void {
    let fla = this.authServ.esAutenticado();
    //console.log(fla);
    if(!fla){
      this.authServ.logout();
      this.respServ.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
      this.authServ.logout();
    }
  }
}
