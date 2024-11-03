import { Component, OnInit } from '@angular/core';
import { GuestService } from 'src/app/services/guest.service';
import { io } from  'socket.io-client';

declare var iziToast:any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent  implements OnInit{

  public contacto: any ={}
  public load_btn = false;
  public socket = io('http://localhost:4201')
  constructor (
    private _guestService:GuestService
  ){ }

ngOnInit(): void {
    
}


registro(registroForm:any){
  if(registroForm.valid){
    this.load_btn=true;
    this._guestService.enviar_mensaje_contacto(this.contacto).subscribe(
      response=>{
        console.log(response);
        iziToast.show({
          title: 'COMPLETADO',
          titleColor: '#1FCB0D',
          color: '#FFF',
          iconUrl: 'assets/img/check_success.png',
          class: 'text-success',
          position: 'topRight',
          message: 'Se envío correctamente el mensaje.',
        });
        this.socket.emit('create-contacto-tienda',{data:response.data})
        this.contacto ={}
        this.load_btn=false;
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
