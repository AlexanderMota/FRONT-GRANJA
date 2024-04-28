import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { VehiculoModel } from 'src/app/models/vehiculo.model';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.css']
})
export class TransporteComponent implements OnInit {
  showP : boolean= false;
  titulo="Transporte";
  posttitulo="Lista de todos los vehiculos de esta sede";

  vehiculos : VehiculoModel[] = [];
  constructor(private vehiServ:VehiculoService) { }

  ngOnInit(): void {
      this.vehiServ.getAllVehiculos(localStorage.getItem('token')!).subscribe(res=>{
      if(res instanceof ApiResponse){
        console.log(res.message);
      }else{
        this.vehiculos = res;
      }
      //console.log(this.empleados);
    });
  }
  abreVentana(){
    this.showP = true;
  }
  receiveMessage($event: boolean){
    this.showP = $event;
  }
}
