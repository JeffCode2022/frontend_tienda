import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { global } from "./global";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = global.url;
  }

  login_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + 'login_cliente', data, { headers: headers });
  }
  
  obtener_cliente_guest(id: any, token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_cliente_guest/'+ id, { headers: headers });
  }

  actualizar_perfil_cliente_guest(id:any,data: any, token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + 'actualizar_perfil_cliente_guest/'+ id,data, { headers: headers });
  }


  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');


    if (!token) {
      return false;
    }
    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);
      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }
      
      if (!decodedToken) {
        console.log('No es válido');
        localStorage.clear();
        return false;
      } 
    } catch (error) {
      localStorage.clear();
      return false;
    } 


    return true;
  }

  obtener_config_public(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_config_public', { headers: headers });
  }

  listar_productos_publico(filtro:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_publico/'+ filtro, { headers: headers });
  }

  agregar_carrito_cliente(data:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + 'agregar_carrito_cliente',data, { headers: headers });
  }

  obtener_carrito_cliente(id:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_carrito_cliente/'+id, { headers: headers });
  }

  eliminar_carrito_cliente(id:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url + 'eliminar_carrito_cliente/'+id, { headers: headers });
  }

  actualizar_cantidad_carrito(id:any,data: any, token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + 'actualizar_cantidad_carrito/'+ id,data, { headers: headers });
  }

  registro_direccion_cliente(data:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + 'registro_direccion_cliente',data ,{ headers: headers });
  }

  obtener_direccion_todos_cliente(id:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_direccion_todos_cliente/'+id,{ headers: headers });
  }

  cambiar_direccion_principal_cliente(id:any ,cliente:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + 'cambiar_direccion_principal_cliente/'+id+'/'+cliente,{data:true},{ headers: headers });
  }

  obtener_direccion_principal_cliente(id:any,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_direccion_principal_cliente/'+id,{ headers: headers });
  }

  eliminar_direccion_principal_cliente(id:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url + 'eliminar_direccion_principal_cliente/'+id, { headers: headers });
  }

  registro_compra_cliente(data:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + 'registro_compra_cliente',data ,{ headers: headers });
  }

  get_token_culqi(data:any): Observable<any> {
    let headers= new HttpHeaders()
    .set('Content-Type','application/json')
    .set('Authorization','Bearer pk_test_b960d77b2fb9a529')
    return this._http.post('https://secure.culqi.com/v2/tokens',data ,{ headers: headers });
  }

  get_charge_culqi(data:any): Observable<any> {
    let headers= new HttpHeaders()
    .set('Content-Type','application/json')
    .set('Authorization','Bearer sk_test_VKdqqwwfyKWT8OWa')
    return this._http.post('https://api.culqi.com/v2/charges',data ,{ headers: headers });
  }

  enviar_correo_compra_cliente(id:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'enviar_correo_compra_cliente/'+id ,{ headers: headers });
  }

  validar_cupon_admin(cupon:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'validar_cupon_admin/'+ cupon ,{ headers: headers });
  }

  utilizar_cupon_cliente(cupon: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    let options = { headers: headers };
    return this._http.put(this.url + 'utilizar_cupon_cliente/' + cupon, {}, options);
  }
  
  obtener_ordenes_cliente(id:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_ordenes_cliente/'+ id ,{ headers: headers });
  }

  obtener_detalles_ordenes_cliente(id:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_detalles_ordenes_cliente/'+ id ,{ headers: headers });
  }

  emitir_review_producto_cliente(data:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + 'emitir_review_producto_cliente',data,{ headers: headers });
  }

  obtener_review_producto_cliente(id:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_review_producto_cliente/'+id, { headers: headers });
  }

  obtener_review_cliente(id:any ,token:any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_review_cliente/'+id,{ headers: headers });
  }
}
