import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { global } from "./global";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = global.url;
  }
  obtener_producto_slug_publico(slug:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_producto_slug_publico/'+slug, { headers: headers });
  }

  listar_producto_recomendados_publico(categoria:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_producto_recomendados_publico/'+categoria, { headers: headers });
  }

  obtener_descuento_activo(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_descuento_activo/', { headers: headers });
  }

  listar_productos_nuevos_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_nuevos_publico/', { headers: headers });
  }

  listar_productos_masvendidos_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_masvendidos_publico/', { headers: headers });
  }

  enviar_mensaje_contacto(data:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'enviar_mensaje_contacto/', data,{ headers: headers });
  }
 
  obtener_reviews_producto_publico(id:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_reviews_producto_publico/'+id, { headers: headers });
  }

  registro_cliente_guest(data:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'registro_cliente_guest/',data, { headers: headers });
  }

  get_Regiones(): Observable<any> {
    return this._http.get('./assets/regiones.json');
  }
  get_Distritos(): Observable<any> {
    return this._http.get('./assets/distritos.json');
  }
  get_Provincias(): Observable<any> {
    return this._http.get('./assets/provincias.json');
  }
  get_Envios(): Observable<any> {
    return this._http.get('./assets/envios.json');
  }

}

