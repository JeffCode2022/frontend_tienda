import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { global } from 'src/app/services/global';
import { GuestService } from 'src/app/services/guest.service';
import { io } from  'socket.io-client';

declare var tns:any;
declare var lightGallery:any;
declare var iziToast:any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

public token:any;
public slug:any;
public producto : any = {};
public url: any;
public productos_rec: Array<any>= [];
public carrito_data : any ={
  variedad: '',
  cantidad: 1
};
public btn_cart= false;
public socket = io('http://localhost:4201')
public descuento_activo: any = undefined;
public reviews: Array<any>=[]
public page = 1;
public pageSize = 5;
public count_five_start=0;
public count_four_start=0;
public count_three_start=0;
public count_two_start=0;
public count_one_start=0;

public total_puntos=0;
public max_puntos=0;
public porcent_ranting=0;
public puntos_ranting=0;

public cinco_porcent=0;
public cuatro_porcent=0;
public tres_porcent=0;
public dos_porcent=0;
public uno_porcent=0;


constructor(
    private _route : ActivatedRoute,
    private _guestService: GuestService,
    private _clienteService: ClienteService
){ 
  this.token = localStorage.getItem('token')
  this.url = global.url;
  this._route.params.subscribe(
    params=>{
      this.slug = params['slug'];
      
      this,_guestService.obtener_producto_slug_publico(this.slug).subscribe(
        response=>{
          this.producto = response.data;
          this._guestService.obtener_reviews_producto_publico(this.producto._id).subscribe(
            response=>{
              response.data.forEach((element:any) => {
                if(element.estrellas ==5 ||element.estrellas== 4.5){
                  this.count_five_start = this.count_five_start +1;
                }else if(element.estrellas ==4 ||element.estrellas== 3.5){
                  this.count_four_start = this.count_four_start +1;
                }else if(element.estrellas ==3 || element.estrellas== 2.5){
                  this.count_three_start = this.count_three_start +1;
                }else if(element.estrellas ==2 || element.estrellas== 1.5){
                  this.count_two_start = this.count_two_start +1;
                }else if(element.estrellas ==1 || element.estrellas== 0.5){
                  this.count_one_start = this.count_one_start +1;
                }

                this.cinco_porcent = (this.count_five_start*100)/response.data.length;
                this.cuatro_porcent = (this.count_four_start*100)/response.data.length
                this.tres_porcent = (this.count_three_start*100)/response.data.length
                this.dos_porcent = (this.count_two_start*100)/response.data.length
                this.uno_porcent = (this.count_one_start*100)/response.data.length

                let puntos_cinco=0;
                let puntos_cuatro=0;
                let puntos_tres=0;
                let puntos_dos=0;
                let puntos_uno=0;

                puntos_cinco= this.count_five_start * 5;
                puntos_cuatro= this.count_four_start * 4;
                puntos_tres= this.count_three_start * 3;
                puntos_dos= this.count_two_start * 2;
                puntos_uno= this.count_one_start * 1;

                this.total_puntos = puntos_cinco + puntos_cuatro + puntos_tres + puntos_dos + puntos_uno
                this.max_puntos= response.data.length * 5;

                this.porcent_ranting = (this.total_puntos*100)/this.max_puntos;
                this.puntos_ranting = (this.porcent_ranting*5)/100;
                     

              })                
              this.reviews=response.data;
              
            }
          )
          this._guestService.listar_producto_recomendados_publico(this.producto.categoria).subscribe(
            response=>{
              this.productos_rec = response.data;
              
            }
          )
          
        }
      )
      
    }
  )
}

ngOnInit(): void {

  this._guestService.obtener_descuento_activo().subscribe(
    response=>{
      if(response.data != undefined){
         this.descuento_activo = response.data[0];
      }else{
        this.descuento_activo = undefined;
      }
    }
  )


  setTimeout(()=>{
    tns({
      container: '.gallery',
      controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
      navPosition: "top",
      controlsPosition: "top",
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      navContainer: "#cs-thumbnails",
      navAsThumbnails: true,
      gutter: 15,
    });
    var e = document.querySelectorAll(".cs-gallery");
    if (e.length){
      for (var t = 0; t < e.length; t++){
        lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
      }
    }
    tns({
      container: '.cs-carousel-inner-two',
      controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
      navPosition: "top",
      controlsPosition: "top",
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      nav: false,
      controlsContainer: "#custom-controls-related",
      responsive: {
        0: {
          items: 1,
          gutter: 20
        },
        480: {
          items: 2,
          gutter: 24
        },
        700: {
          items: 3,
          gutter: 24
        },
        1100: {
          items: 4,
          gutter: 30
        }
      }
    });
  },100)

}

agregar_producto(){
  
    if(this.carrito_data.cantidad <= this.producto.stock){
      let data={
        producto: this.producto._id,
        cliente: localStorage.getItem('_id'),
        cantidad: this.carrito_data.cantidad,
        variedad: this.carrito_data.variedad,     
      }
      this.btn_cart = true;
      this._clienteService.agregar_carrito_cliente(data,this.token).subscribe(
        response=>{
          if(response.data == undefined){
            iziToast.error({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              iconUrl: 'assets/img/error-icon.png',
              class: 'text-danger',
              position: 'topRight',
              message: 'El producto ya existe en el carrito'
            })
            this.btn_cart = false;
          }else{
            iziToast.show({
              title: 'COMPLETADO',
              titleColor: '#1FCB0D',
              color: '#FFF',
              iconUrl: 'assets/img/check_success.png',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agregó el producto al carrito.',
            });
            this.socket.emit('delete-carrito',{data:response.data})
            this.btn_cart = false;
          }
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
        message: 'La máxima cantidad disponible es: ' + this.producto.stock
      })
    }
}


}
