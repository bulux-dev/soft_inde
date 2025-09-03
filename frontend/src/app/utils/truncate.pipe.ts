import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 10, addTooltip: boolean = true): string {
    if (!value) {
      return '';
    }

    let truncated = value.length > limit ? value.substring(0, limit) + '...' : value;

    return addTooltip && value.length > limit
      ? `<span title="${value}">${truncated}</span>`
      : truncated;
  }
}
