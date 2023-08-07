import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html'
})
export class TareaComponent implements OnInit {
  public edita:boolean=false;
  constructor(private actRoute:ActivatedRoute) { 
    this.actRoute.params.subscribe(params=>{
      if(!params['id']){
        this.edita = true;
      }
    });
  };
  
  ngOnInit(): void {
  }

}
