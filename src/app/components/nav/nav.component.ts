import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { global } from 'src/app/services/global';
import { io } from  'socket.io-client';
import { GuestService } from 'src/app/services/guest.service';

declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token: any;
  public id: any;
  public user: any = undefined;
  public user_lc: any = undefined;
  public config_global : any={};
  public op_cart= false;
  public carrito_arr : Array<any>=[];
  public url:any
  public subtotal=0;
  public socket = io('http://localhost:4201')
  public descuento_activo : any = undefined;


  constructor(
    private _clienteService: ClienteService,
    private _router: Router,
    private _guestService: GuestService
  ) {

    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.url =  global.url

    this._clienteService.obtener_config_public().subscribe(
      response=>{
        this.config_global=response.data; 
        
      }
    )

    this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
      response => {
        this.user = response.data;
        localStorage.setItem('user_data', JSON.stringify(this.user))
        
        if (localStorage.getItem('user_data')) {
          const userDataString = localStorage.getItem('user_data');
          this.user_lc = userDataString !== null ? JSON.parse(userDataString) : null;
          this.obtener_carrito();
          
        } else {
          this.user_lc = undefined;
        }
      },
      error => {
        console.log(error);
        this.user = undefined;
      }
    )
  }


  obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id,this.token).subscribe(
      response=>{
        this.carrito_arr=response.data;  
     
        this.calcular_carrito();   
      }
    )
  }

  ngOnInit(): void {

    
    
    this.socket.on('new-carrito', (data: any) => {
      this.obtener_carrito();
    });

    this.socket.on('new-carrito-add', (data: any) => {
      this.obtener_carrito();
    });

    this._guestService.obtener_descuento_activo().subscribe(
      response=>{
        if(response.data != undefined){
           this.descuento_activo = response.data[0];
           
        }else{
          this.descuento_activo = undefined;
        }
      }
    )
    
  }


  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/'])

  }

  op_modalCart(){
    if(!this.op_cart){
      this.op_cart = true;
      $('#cart').addClass('show');
    }else{
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
  }

  aviso_login(){
    iziToast.error({
      color: '#FFF',
      iconUrl: 'assets/img/warning.png',
      class: 'text-danger',
      position: 'topRight',
      message: 'Debes iniciar Sesión para adquirir nuestros Productos',
    })
  }


  eliminar_item(id:any){
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'COMPLETADO',
          titleColor: '#1FCB0D',
          color: '#FFF',
          iconUrl: 'assets/img/check_success.png',
          class: 'text-success',
          position: 'bottomRight',
          message: 'Se eliminó el producto del carrito.',
        });
        this.socket.emit('delete-carrito',{data:response.data})
        
      }
    )
  }
  
  calcular_carrito(){
    
    this.subtotal= 0;
    if(this.descuento_activo == undefined){
      this.carrito_arr.forEach(element =>{
        this.subtotal= this.subtotal + parseFloat(element.producto.precio);
      })
    }else if(this.descuento_activo != undefined){
      this.carrito_arr.forEach(element => {
        let new_precio = ((element.producto.precio) - ((element.producto.precio) * this.descuento_activo.descuento) / 100);
        
        // Redondear al múltiplo más cercano de 0.10
        let roundedPrice = Math.round(new_precio * 10) / 10; // Redondear a un decimal
        
        if (roundedPrice * 10 % 10 < 5) {
          roundedPrice = Math.floor(roundedPrice * 10) / 10; // Redondear hacia abajo si el decimal es menor a 5
        } else {
          roundedPrice = Math.ceil(roundedPrice * 10) / 10; // Redondear hacia arriba si el decimal es mayor o igual a 5
        }
        
        this.subtotal = (this.subtotal + roundedPrice);
      })
      
    }
  }

}
