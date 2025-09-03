import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'hace',
  standalone: true
})
export class HacePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      let fecha = moment(value);
      let hoy = moment();
      let diff = hoy.diff(fecha, 'days');
      if (diff >= 1) {
        return moment(value).format(args[0] ? args[0] : 'DD/MM/YYYY HH:mm');
      }
      return moment(value).fromNow();;
    }
    return '--'
  }

}
