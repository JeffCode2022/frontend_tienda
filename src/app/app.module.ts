import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from "@angular/forms";
import { NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import { HttpClient, HttpClientModule} from "@angular/common/http";
import { routing} from "./app.routing";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { SiderbarComponent } from './components/usuario/siderbar/siderbar.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { DescuentoPipe } from './pipes/descuento.pipe';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexOrdenesComponent } from './components/usuario/ordenes/index-ordenes/index-ordenes.component';
import { DetalleOrdenComponent } from './components/usuario/ordenes/detalle-orden/detalle-orden.component';
import { NgxStarsModule } from 'ngx-stars';
import { IndexReviewComponent } from './components/usuario/review/index.review/index.review.component';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    InicioComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    PerfilComponent,
    SiderbarComponent,
    IndexProductoComponent,
    ShowProductoComponent,
    CarritoComponent,
    DireccionesComponent,
    DescuentoPipe,
    ContactoComponent,
    IndexOrdenesComponent,
    DetalleOrdenComponent,
    IndexReviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbPaginationModule,
    NgxStarsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


