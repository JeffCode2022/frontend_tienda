import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from 'src/app/services/guest.service';
declare var iziToast: any;
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};
  public token: any
  public usuario_register: any = {
    genero: ''
  }
  public passwordFieldType: string = 'password';
  constructor(
    private _clienteService: ClienteService,
    private _guestService: GuestService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this._router.navigate(['/']);
    }
  }

  ngOnInit(): void {

   
  }
  login(loginForm: any) {
    if (loginForm.valid) {
      let data = {
        email: this.user.email,
        password: this.user.password
      }
      this._clienteService.login_cliente(data).subscribe(
        response => {
          if (response.data == undefined) {
            iziToast.error({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              iconUrl: 'assets/img/error-icon.png',
              class: 'text-danger',
              position: 'topRight',
              message: response.message,
            })
          } else {
            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);

            this._router.navigate(['/']);
          }
        },
        error => {
          console.log(error);

        }
      )
    } else {
      iziToast.error({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        iconUrl: 'assets/img/error-icon.png',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del Formulario no son válidos',
      })
    }
  }

  registro(registroForm: any) {
    if (this.usuario_register.password !== this.usuario_register.password2) {
      iziToast.error({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        iconUrl: 'assets/img/error-icon.png',
        class: 'text-danger',
        position: 'bottomRight',
        message: 'Las contraseñas deben coincidir'
        
      })
      this.usuario_register = {
        nombres: '',
        apellidos: '',
        password: '',
        password2: '' 
      };
    } else {
      if (registroForm.valid) {
        this._guestService.registro_cliente_guest(this.usuario_register).subscribe(
          response => {
            iziToast.show({
              title: 'COMPLETADO',
              titleColor: '#1FCB0D',
              color: '#FFF',
              iconUrl: 'assets/img/check_success.png',
              class: 'text-success',
              position: 'bottomRight',
              message: 'Te has registrado correctamente',
            }); 
            this.usuario_register = {
              nombres: '',
              apellidos: '',
              password: '',
              password2: '' 
            };

              $('#login').modal('hide');
              $('.modal-backdrop').removeClass('show');             
          },
        );
      } 
    }
  }
  

  mostrar_password(){
    const passwordInput = document.getElementById('txtPassword') as HTMLInputElement;
    if (this.passwordFieldType === 'password') {
      passwordInput.type = 'text';
      $('.icon').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    } else {
      passwordInput.type = 'password';
      $('.icon').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    }
    this.passwordFieldType = passwordInput.type;
  }

  mostrar_password_register1() {
    const passwordInput = document.getElementById('txtPassword1') as HTMLInputElement;
    const icon = document.getElementById('icon1');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon?.classList.remove('fa-eye-slash');
      icon?.classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      icon?.classList.remove('fa-eye');
      icon?.classList.add('fa-eye-slash');
    }
  }

  mostrar_password_register2() {
    const passwordInput = document.getElementById('txtPassword2') as HTMLInputElement;
    const icon = document.getElementById('icon2');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon?.classList.remove('fa-eye-slash');
      icon?.classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      icon?.classList.remove('fa-eye');
      icon?.classList.add('fa-eye-slash');
    }
  }
  cerrarModal(){
    this.usuario_register = {
      nombres: '',
      apellidos: '',
      password: '',
      password2: '' 
    };
  }
}