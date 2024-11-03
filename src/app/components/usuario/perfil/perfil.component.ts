import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;
declare var $:any;
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente: any = {}
  public token:any;
  public id:any;
  constructor(
    private _clienteService : ClienteService
  ){ 
    this.id = localStorage.getItem('_id');
    this.token= localStorage.getItem('token');

    if(this.id){
      this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
        response=>{
         this.cliente=response.data;
        },
        error=>{
          console.log(error);
          
        }
      )
    }
  }

ngOnInit(): void {
    
}

actualizar(actualizarForm:any){
  if(actualizarForm.valid){
    this.cliente.password = $('#input_password').val();
    this._clienteService.actualizar_perfil_cliente_guest(this.id,this.cliente,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'COMPLETADO',
          titleColor: '#1FCB0D',
          color: '#FFF',
          iconUrl: 'assets/img/check_success.png',
          class: 'text-success',
          position: 'topRight',
          message: 'Se actualizó su perfil correctamente.',
        });
        
      },
      error=>{
        console.log(error);
        
      }
    )
    
  }else{
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
}
