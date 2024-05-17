import { Component, Input, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { EmpleadoModel } from 'src/app/models/empleado.model';
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

  constructor(private empServ:EmpleadoService){
  }

  ngOnInit(): void {
    this.empServ.getEmpleadoById(localStorage.getItem('token')!,this.comentario.idAutor).subscribe({next:res=>{
      if((res as ApiResponse).status) console.log((res as ApiResponse).message);
      else this.autor = (res as EmpleadoModel).nombre + " " + (res as EmpleadoModel).apellidos;
    },error:err=>
      console.log(err.message)
    });
  }
}
