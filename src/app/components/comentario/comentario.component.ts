import { Component, Input, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css']
})
export class ComentarioComponent implements OnInit{
  @Input()
  comentario : ComentarioModel = new ComentarioModel();
  autor = "";
  puedeEliminar = false;

  constructor(private empServ:EmpleadoService, 
    private comServ:ComentarioService, private resServ : ApiResponseService){
  }

  ngOnInit(): void {
    this.empServ.getEmpleadoById(localStorage.getItem('token')!,this.comentario.idAutor).subscribe({next:res=>{
      if((res as ApiResponse).status) console.log((res as ApiResponse).message);
      else{
        this.autor = (res as EmpleadoModel).nombre + " " + (res as EmpleadoModel).apellidos;
        if(localStorage.getItem('miid')! == this.comentario.idAutor){
          this.puedeEliminar = true;
        }
      } 
    },error:err=>
      console.log(err.message)
    });
  }
  borraComment(){
    this.comServ.deleteComentarioTarea(localStorage.getItem('token')!,this.comentario._id).subscribe({next:res=>{
      if(res.status < 220){
        this.resServ.resMensajeSucBtn(res.message);
      }else{
        this.resServ.resMensajeErrBtn(res.message);
      }
    },error:err=>console.log(err)});
  }
}
