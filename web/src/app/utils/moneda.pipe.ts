import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda',
  standalone: true
})
export class MonedaPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let number: any = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100);
    let text = number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    text = text.replace('$', args[0])
    return text
  }

}
