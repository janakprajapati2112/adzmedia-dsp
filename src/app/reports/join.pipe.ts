import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'join'
})
export class JoinPipe implements PipeTransform {

    transform(input: any, character: string = ''): any {

        console.log(input);
        console.log(character)
        /*if (!isArray(input)) {
          return input;
        }*/

        return input.join(character);
    }
}