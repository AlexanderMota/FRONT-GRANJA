import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { VehiculoModel } from 'src/app/models/vehiculo.model';
import { TareaService } from 'src/app/services/tarea.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css']
})
export class UbicacionComponent implements OnInit {
  @Input()
  vehiculoCompanero : {
    vehiculo: VehiculoModel,
    paradas: UbicacionModel[]
  } = {
    vehiculo: new VehiculoModel(),
    paradas: []
  };

  ubis:UbicacionModel[]=[];
  
  constructor( /*private ubiServ:UbicacionServic*/ ){ 
  }

  ngOnInit(): void {
    
  }
}
