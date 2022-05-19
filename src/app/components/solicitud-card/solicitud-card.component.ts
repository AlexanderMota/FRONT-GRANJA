import { Component, Input, OnInit } from '@angular/core';
import { SolicitudModel } from 'src/app/models/solicitud.model';

@Component({
  selector: 'app-solicitud-card',
  templateUrl: './solicitud-card.component.html',
  styleUrls: ['./solicitud-card.component.css']
})
export class SolicitudCardComponent implements OnInit {

  @Input() solicitud:SolicitudModel = new SolicitudModel();
  @Input() index:number = 0;
  
  constructor() { }

  ngOnInit(): void {
  }
  verHeroe(){
    
  }
}