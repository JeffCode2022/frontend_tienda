import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descuento'
})
export class DescuentoPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let descuento = value - (value * args[0]) / 100;
    
    // Redondear al número entero más cercano
    descuento = Math.round(descuento * 10) / 10;

    return descuento.toFixed(2); 
  }

}
