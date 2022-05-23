import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ApiResponseService {

  constructor() { }
  resMensajeSucBtn(msn:string){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'success'
    });
  }
  resMensajeErrBtnRedir(msn:string,redir:string){

  }
  resMensajeErrBtn(msn:string){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'error'
    });
  }
  resMensajeWrnBtn(msn:string){

    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'warning'
    });
  }
  resCargando(msn:string){
    
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'info'
    });
    Swal.showLoading();

  };
}

