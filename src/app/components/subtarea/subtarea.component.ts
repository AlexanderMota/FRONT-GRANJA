import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { TareaService } from 'src/app/services/tarea.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subtarea',
  templateUrl: './subtarea.component.html',
  styleUrls: ['./subtarea.component.css']
})
export class SubtareaComponent implements OnInit {

  @Input()
  subtareas : TareaModel[] = [];
  idTarea : string = "";
  constructor(
    private resApi: ApiResponseService,
    private actRoute:ActivatedRoute,
    private localizationService:LocalizationService) { 
    this.actRoute.params.subscribe(async params=>{
    });
  }

  ngOnInit(): void {
  }
  onSubmit(form: NgForm){
    if(!form.valid) return;
    this.localizationService.getString("mensajesInformacion.espere").subscribe(val =>
    this.resApi.resCargando(val));
  }
}
