import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'fecha',
  standalone: true
})
export class FechaPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      return moment(value).format(args[0] ? args[0] : 'DD/MM/YYYY HH:mm');
    }
    return '--'
  }

}
