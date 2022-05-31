import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ComponentMessageService } from 'src/app/services/component-message.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-tarea-details',
  templateUrl: './tarea-details.component.html',
  styleUrls: ['./tarea-details.component.css']
})
export class TareaDetailsComponent implements OnInit {
  tarea: TareaModel = new TareaModel();
  empleados: EmpleadoModel[] = [];
  @Input() oculto:boolean = false;
  private paramId : string = "";

  constructor(private tarServ:TareaService, 
    private empServ: EmpleadoService,
    private compMess:ComponentMessageService,
    private actRoute:ActivatedRoute) {
    
      this.actRoute.params.subscribe(params=>{
        //console.log(params);
          if(params['id']){
            this.paramId = params['id'];
            this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId)
            .subscribe(async res=>{
              this.tarea=res;
            });
            this.empServ.getEmpleadosByTarea(localStorage.getItem('token')!,this.paramId)
            .subscribe(res2=>{
              console.log(res2);
              this.empleados=res2;
              console.log(this.empleados);
            });
          }else{
            
          }
        });
    //console.log(this.empleados);
 }
 oculta(){
   this.oculto = !this.oculto;
   this.compMess.emiteDato.emit({dato:this.oculto});
 }
  ngOnInit(): void {
  }

}
