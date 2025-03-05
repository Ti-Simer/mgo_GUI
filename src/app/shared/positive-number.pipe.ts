import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positiveNumber'
})
export class PositiveNumberPipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
