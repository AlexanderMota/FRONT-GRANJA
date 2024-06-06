import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VehiculoModel } from 'src/app/models/vehiculo.model';

@Component({
  selector: 'app-transporte-card',
  templateUrl: './transporte-card.component.html',
  styleUrls: ['./transporte-card.component.css']
})
export class TransporteCardComponent implements OnInit {

  @Input() vehi:VehiculoModel = new VehiculoModel();
  @Input() index:number = 0;

  ngOnInit(): void {
  }
  eliminaVehiculo() {
    console.log("eliminaVehiculo() to do");
  }
}
