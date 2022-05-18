import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { ExpectedConditions } from 'protractor';
//import { UnsubscriptionError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

usuario : UsuarioModel = new UsuarioModel();

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.usuario.nombre = "admin";
    this.usuario.password = "admin";
  }
  login(form: NgForm){
    if(!form.valid){
      return;
    }

    Swal.fire({
      title: 'Error!',
      text: 'Do you want to continue',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
    /*let timerInterval;
    Swal.fire({
      title: 'Auto close alert!',
      html: 'I will close in <b></b> milliseconds.',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft().toString()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      // Read more about handling dismissals below 
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })*/
    this.auth.login(this.usuario);
  }
}
