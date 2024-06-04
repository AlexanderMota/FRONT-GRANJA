import { Component, OnInit } from '@angular/core';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { EstadisticaService } from 'src/app/services/estadistica.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'/*,
  styleUrls: ['./home.component.css']*/
})
export class HomeComponent implements OnInit {

  constructor(private authServ: AuthService,
    private respServ:ApiResponseService,
    private estServ: EstadisticaService ) {

  }
  ngOnInit(): void {
    this.estServ.getComentariosEst(localStorage.getItem("token")!).subscribe(val => {
      console.log(val);
    });
    let fla = this.authServ.esAutenticado();
    //console.log(fla);
    if(!fla){
      this.authServ.logout();
      this.respServ.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
      this.authServ.logout();
    }
  }
}
