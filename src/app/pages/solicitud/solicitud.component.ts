import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudModel } from 'src/app/models/solicitud.model';
import { SolicitudService } from 'src/app/services/solicitud.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html'
})
export class SolicitudComponent /*implements OnInit*/ {

  solicitud:SolicitudModel=new SolicitudModel();
  constructor(private solServ:SolicitudService, private actRoute:ActivatedRoute) { 
    this.actRoute.params.subscribe(params=>{
      console.log(params);
      solServ.getSolicitud(localStorage.getItem('token')!,params['id']).subscribe(res=>{
        this.solicitud=res;
      });
    });
  }

  /*ngOnInit(): void {
  }*/

}