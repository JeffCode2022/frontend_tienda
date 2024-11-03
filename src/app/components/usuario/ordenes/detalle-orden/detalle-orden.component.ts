import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { global } from 'src/app/services/global';
import { GuestService } from 'src/app/services/guest.service';
declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent  implements OnInit{

  public url:any;
  public token:any;
  public orden : any = {};
  public detalles: Array<any> = [];
  public load_data = true;
  public id:any
  public direcciones: Array<any>= [];
  public descuento_activo : any = undefined
  public ratingDisplay: number=0;
  public review: any ={}
 
  constructor(
    private _clienteService: ClienteService,
    private _route:ActivatedRoute,
    private _guestService:GuestService,
  ){ 
    this.token=localStorage.getItem('token')
    this.url = global.url;
    
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.init_data();

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
    this.obtener_direccion_cliente();
    
}
init_data(){
  this._clienteService.obtener_detalles_ordenes_cliente(this.id,this.token).subscribe(
    response=>{
      if(response.data !=undefined){
        this.orden = response.data;
        response.detalles.forEach((element:any)=>{
          this._clienteService.obtener_review_producto_cliente(element.producto._id).subscribe(
            response=>{
              let emitido=false;
              response.data.forEach((element_:any) => {
                if(element_.cliente ==localStorage.getItem('_id')){
                   emitido=true;
                }
              });
              element.estado = emitido;
            }
          )
        })
        this.detalles = response.detalles;
        this.load_data=false;
      }else{
        this.orden= undefined;
      }
      console.log(this.detalles);
      
    }
  )
}
  
onRatingSet(rating: number): void {
  this.ratingDisplay = rating;
}
  emitir(id:any){
    if(this.review.review){
      
      if(this.ratingDisplay && this.ratingDisplay >=0){
        this.review.estrellas = this.ratingDisplay

        this._clienteService.emitir_review_producto_cliente(this.review,this.token).subscribe(
          response=>{
            iziToast.show({
              title: 'COMPLETADO',
              titleColor: '#1FCB0D',
              color: '#FFF',
              iconUrl: 'assets/img/check_success.png',
              class: 'text-success',
              position: 'bottomRight',
              message: 'Se emitió correctamente la reseña',
            });
            $('#review-'+id).modal('hide');
            $('.modal-backdrop').removeClass('show');
            this.init_data();
          }
        )
        
      }else{
        iziToast.error({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          iconUrl: 'assets/img/error-icon.png',
          class: 'text-danger',
          position: 'bottomRight',
          message: 'Seleccione el número de estrellas',
        })
      }
    }else{
      iziToast.error({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        iconUrl: 'assets/img/error-icon.png',
        class: 'text-danger',
        position: 'bottomRight',
        message: 'Ingrese un mensaje en la reseña',
      })
    }
  }
openModal(item:any){
  this.review ={}

  this.review.producto = item.producto._id;
  this.review.cliente = item.cliente;
  this.review.venta= this.id;

  
}
obtener_direccion_cliente(){
  this._clienteService.obtener_direccion_todos_cliente(localStorage.getItem('_id'),this.token).subscribe(
    response=>{
     this.direcciones=response.data
    this.load_data=false
    }
  )
  }

}
