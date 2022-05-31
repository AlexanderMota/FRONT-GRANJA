import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html'
})
export class TareaComponent implements OnInit {
  public edita:boolean=false;
  //tarea:TareaModel=new TareaModel();
  constructor(private tarServ:TareaService, private actRoute:ActivatedRoute) { 
    /*this.actRoute.params.subscribe(params=>{
      tarServ.getTareaById(localStorage.getItem('token')!,params['id']).subscribe(res=>{
        this.tarea=res;
        //console.log(this.tarea);
      });
    });*/
  }

  ngOnInit(): void {
  }

}
