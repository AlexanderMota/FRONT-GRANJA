import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { TareaService } from 'src/app/services/tarea.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css']
})
export class UbicacionComponent implements OnInit {
  @Input()
  idEmpleado : string = "";

  ubis:UbicacionModel[]=[];
  
  constructor( private ubiServ:UbicacionService ){ 
    console.log(this.idEmpleado);
  }

  ngOnInit(): void {
    console.log(this.idEmpleado);
    this.ubiServ.getMisParadas(localStorage.getItem('token')!,this.idEmpleado).subscribe({next:res=>{
      console.log(res);
    },error:err=>console.log(err)});
  }
}
