import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
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
    private actRoute:ActivatedRoute,
    private resPop:ApiResponseService) {
    
      this.actRoute.params.subscribe(async params=>{
        //console.log(params);
          if(params['id']){
            this.paramId = params['id'];
            await this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId)
            .subscribe(async res=>{
              this.tarea=res;
            });
            await this.empServ.getEmpleadosByTarea(localStorage.getItem('token')!,
              this.paramId).subscribe(res2=>{
              this.empleados=res2;
            });
          }else{
            
          }
        });
  }
  oculta(){
    this.oculto = !this.oculto;
    this.compMess.emiteDato.emit({dato:this.oculto});
  }
  async borraTarea(){
    let flag = false;
    this.resPop.resCargando('Espere...');
    await this.tarServ.deleteTarea(localStorage.getItem('token')!,this.tarea).subscribe(res=>{
      flag = res;
      if(flag){
        this.resPop.resMensajeSucBtnRedir("Tarea eliminada correctamente.","tareas")
      }else{
        this.resPop.resMensajeErrBtn("La tarea no se eliminó correctamente.")
      }
    })
  }
  ngOnInit(): void {
  }

}
