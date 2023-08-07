import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css']
})
export class UbicacionComponent implements OnInit {

  private idTarea : string = "";
  subtareas : TareaModel[] = [];

  /*
  constructor(
      private actRoute:ActivatedRoute,
      private tarServ:TareaService) {
    this.actRoute.params.subscribe(async params=>{
      if(params['id']){
        this.idTarea = params['id'];
        await this.tarServ.getSubtareas(localStorage.getItem('token')!,this.idTarea)
        .subscribe(async res=>{
          this.subtareas=res;
          //console.log("comentarios paramID: " + this.comentarios[0].descripcion);
        });
      }else{
        
      }
    }); }*/

  ngOnInit(): void {
  }
}
