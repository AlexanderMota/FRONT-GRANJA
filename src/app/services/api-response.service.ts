import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ApiResponseService {

  constructor(private router:Router) { }
  resMensajeSucBtn(msn:string){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'success'
    });
  }
  resMensajeSucBtnRedir(msn:string,redir:string){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'success'
    }).then((result)=>{
      if (result.isConfirmed) {
        this.router.navigateByUrl(redir);
      }
    });
  }
  resMensajeErrBtn(msn:string){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'error'
    });
  }
  resMensajeErrBtnRedir(msn:string,redir:string){

    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'error'
    }).then((result)=>{
      if (result.isConfirmed) {
        this.router.navigateByUrl(redir);
      }
    });
  }
  resMensajeWrnBtn(msn:string){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'warning'
    });
  }
  resMensajeWrnBtnRedir(msn:string,redir:string){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'warning'
    }).then((result)=>{
      if (result.isConfirmed) {
        this.router.navigateByUrl(redir);
      }
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

