import { Component, OnInit } from '@angular/core';
import { VehiculoModel } from 'src/app/models/vehiculo.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'/*,
  styleUrls: ['./home.component.css']*/
})
export class HomeComponent{

  constructor(private authServ: AuthService,
    private respServ:ApiResponseService ) {
    if(!this.authServ.esAutenticado()){
      this.authServ.logout();
      this.respServ.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
      this.authServ.logout();
    }
  }
}
