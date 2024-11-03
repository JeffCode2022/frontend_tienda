import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { global } from 'src/app/services/global';
import { io } from 'socket.io-client';
import { GuestService } from 'src/app/services/guest.service';
import { Router, convertToParamMap } from '@angular/router';
import swal from 'sweetalert2';


declare var Cleave: any;
declare var iziToast: any;
declare var StickySidebar: any;
declare var paypal: any;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  @ViewChild('paypalButton', { static: true }) paypalElement: ElementRef;

  public idCliente: any;
  public token: any;

  public carrito_arr: Array<any> = [];
  public url: any
  public subtotal = 0;
  public total_pagar: any = 0;
  public socket = io('http://localhost:4201')

  public direccion_principal: any = {};
  public envios: Array<any> = [];

  public precio_envio = "0";
  public venta: any = {};
  public dventa: Array<any> = [];
  public card_data: any = {};
  public btn_load = false;
  public carrito_load = true;
  public user: any = {};
  public error_cupon = '';
  public descuento = 0;
  public cupon_utilizado: any = undefined
  public descuento_activo: any = undefined
  public cupon_activo: any
  public precio_descuento : any 
  constructor(
    private _clienteService: ClienteService,
    private _guestService: GuestService,
    private _router: Router
  ) {

    this.idCliente = localStorage.getItem('_id');
    this.venta.cliente = this.idCliente;
    this.token = localStorage.getItem('token');
    this.url = global.url;
    this.paypalElement = <any>

      this._guestService.get_Envios().subscribe(
        response => {
          this.envios = response;

        }
      )
    const userData = localStorage.getItem('user_data');

    if (userData !== null) {
      this.user = JSON.parse(userData);
    } else {

    }
  }

  ngOnInit(): void {

    this.init_Data()
    this._guestService.obtener_descuento_activo().subscribe(
      response => {
        if (response.data != undefined) {
          this.descuento_activo = response.data[0];
        } else {
          this.descuento_activo = undefined;
        }
      })

    setTimeout(() => {
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type: any) {

        }
      })
      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'y']
      })
      var sidebar = new StickySidebar('.sidebar-sticky', { topSpacing: 20 })
    })
    this.get_direccion_principal()

    paypal.Buttons({
      style: {
        layout: 'horizontal'
      },
      createOrder: (data: any, actions: any) => {
        function convertSolesToDollars(solesAmount: any) {

          const conversionRate = 3.73;
          const dollarsAmount = solesAmount / conversionRate;
          const roundedAmount = Math.round(dollarsAmount * 100) / 100;

          return roundedAmount;
        }

        return actions.order.create({
          purchase_units: [{
            description: 'Pago en FerreLomas',
            amount: {
              currency_code: 'USD',
              value: convertSolesToDollars(this.total_pagar)
            },
          }]
        });

      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture();
        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id
        this.venta.detalles = this.dventa;


        function convertDollarsToSoles(dollarsAmount: any) {

          const conversionRate = 3.73;
          const solesAmount = dollarsAmount * conversionRate;
          const roundedAmount = Math.round(solesAmount * 100) / 100;

          return roundedAmount;
        }
        this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
          response => {
            this.subtotal = convertDollarsToSoles(this.total_pagar)
            swal.fire({
              position: "center",
              icon: "success",
              html: `<div style="display: flex; justify-content: center; align-items: center; font-size: 30px;">
                       <span>¡Compra Realizada!</span>
                       <span>
                         <img src="assets/img/paypal-pay.png" alt="PayPal" width="60" height="60" style="position: absolute; bottom: 120px;">
                       </span>
                     </div>
                     <div style="text-align: center;">
                       <p style="margin-top: 20px;">¡Gracias por tu compra!</p>
                       <p style="position: relative; top: -10;">Haz realizado el pago con <b style="color:#17696a">Paypal</b></p>
                     </div>`,
              showConfirmButton: false,
              timer: 4000
            });

            this._clienteService.enviar_correo_compra_cliente(response.venta._id, this.token).subscribe(
              response => {
                this._router.navigate(['/']);
              }
            )
            this._clienteService.utilizar_cupon_cliente(this.venta.cupon, this.token).subscribe(
              response => {

              }
            )
          }

        )
      },
      onError: (err: any) => {
      },
      onCancel: function (data: any, actions: any) {
      }
    }).render(this.paypalElement.nativeElement);

  }
  init_Data() {
    this._clienteService.obtener_carrito_cliente(this.idCliente, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;

        this.carrito_arr.forEach(element => {
          this.dventa.push({
            producto: element.producto._id,
            subtotal: element.producto.precio,
            variedad: element.variedad,
            cantidad: element.cantidad,
            cliente: localStorage.getItem('_id')

          })
        })
        //setTimeout(()=>{
        this.carrito_load = false;
        // },3000)

        this.calcular_carrito();
        this.calcular_total('Envio Gratis');
      })


  }

  calcular_carrito() {
    this.subtotal = 0;
    if (this.descuento_activo == undefined) {
      this.carrito_arr.forEach(element => {
        this.subtotal = this.subtotal + parseFloat(element.producto.precio);
      })
    } else if (this.descuento_activo != undefined) {
      this.carrito_arr.forEach(element => {

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
      })
    }
  }




  get_direccion_principal() {
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.direccion_principal = undefined
        } else {
          this.direccion_principal = response.data;
          this.venta.direccion = this.direccion_principal._id;
        }

      }
    )
  }


  eliminar_item(id: any) {
    this._clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'COMPLETADO',
          titleColor: '#1FCB0D',
          color: '#FFF',
          iconUrl: 'assets/img/check_success.png',
          class: 'text-success',
          position: 'bottomRight',
          message: 'Se eliminó el producto del carrito.',
        });
        this.socket.emit('delete-carrito', { data: response.data })
        this.init_Data();
      }
    )
  }
  calcular_total(envio_titulo: any) {
    this._guestService.obtener_descuento_activo().subscribe(
      response => {
        if (response.data != undefined) {
          this.descuento_activo = response.data[0];
        } else {
          this.descuento_activo = undefined;
        }
        this.subtotal = 0;
        if (this.descuento_activo == undefined) {
          this.carrito_arr.forEach(element => {
            this.subtotal = this.subtotal + parseFloat(element.producto.precio);
          })
        } else if (this.descuento_activo != undefined) {
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
                this.total_pagar = parseFloat(this.subtotal.toString()) + parseFloat(this.precio_envio) 
                this.venta.subtotal = this.total_pagar;
                this.venta.envio_precio = parseFloat(this.precio_envio);
                this.venta.envio_titulo = envio_titulo;    
              }          
    )
  }
  get_token_culqi() {
    let month;
    let year;

    let exp_arr = this.card_data.exp.toString().split('/')



    function convertirMontoACentavos(montoDecimal: number): number {
      const montoEnCentavos = Math.round(montoDecimal * 100); // Convertir a centavos
      return montoEnCentavos;
    }

    const subtotalDecimal = this.total_pagar;

    const montoEnCentavos = convertirMontoACentavos(subtotalDecimal);

    let data = {
      'card_number': this.card_data.ncard.toString().replace(/ /g, ""),
      'cvv': this.card_data.cvc,
      "expiration_month": exp_arr[0],
      "expiration_year": exp_arr[1].toString().substr(0, 2),
      "email": this.user.email,
    }

    this.btn_load = true;

    this._clienteService.get_token_culqi(data).subscribe(
      response => {
        const amount = parseInt(this.total_pagar.toString()+ '00')
        let charge = {
          "amount": montoEnCentavos,
          "currency_code": "PEN",
          "email": this.user.email,
          "source_id": response.id,

        }
        this._clienteService.get_charge_culqi(charge).subscribe(
          response => {
            this.venta.transaccion = response.id;

            this.venta.detalles = this.dventa;
            this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
              response => {
                swal.fire({
                  position: "center",
                  icon: "success",
                  html: `<div style="display: flex; justify-content: center; align-items: center; font-size: 30px;">
                           <span>¡Compra Realizada!</span>
                           <span>
                             <img src="assets/img/tarjeta-pay.png" width="50" height="50" style="position: absolute; right: 70px; bottom: 132px;">
                           </span>
                         </div>
                         <div style="text-align: center;">
                           <p style="margin-top: 20px;">¡Gracias por tu compra!</p>
                           <p style="position: relative; top: -10;">Haz realizado el pago con <b style="color:#17696a">Tarjeta de Crédito.</b></p>
                         </div>`,
                  showConfirmButton: false,
                  timer: 4000
                });
                this.btn_load = false;
                this._clienteService.enviar_correo_compra_cliente(response.venta._id, this.token).subscribe(
                  response => {
                    this._router.navigate(['/']);
                  }
                )
                this._clienteService.utilizar_cupon_cliente(this.venta.cupon, this.token).subscribe(
                  response => {
                    this.cupon_utilizado = response.data
                  }
                )
              }
            )



          }
        )
      }
    )

  }

  validar_cupon() {
    if (this.venta.cupon) {
      if (this.venta.cupon.toString().length <= 15) {

        this._clienteService.validar_cupon_admin(this.venta.cupon, this.token).subscribe(
          response => {
            this.cupon_activo = response.data
            if (this.cupon_activo != undefined) {
              this.error_cupon = '';
              if (this.cupon_activo.tipo == 'Valor fijo') {
                this.descuento = this.cupon_activo.valor;
                this.total_pagar = this.total_pagar - this.descuento
              } else if (this.cupon_activo.tipo == 'Porcentaje') {
                this.descuento = (this.total_pagar * this.cupon_activo.valor) / 100;
                this.total_pagar = this.total_pagar - this.descuento
              }
            } else {
              this.error_cupon = 'El cupón no se pudo canjear'
            }

          }
        )
      } else {
        this.error_cupon = 'El cupón debe ser menor a 15 carácteres'
      }
    } else {
      this.error_cupon = 'Debes ingresar un cupón'
    }
  }
}
